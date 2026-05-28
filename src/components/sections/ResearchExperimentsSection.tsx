import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, onSnapshot, limit } from "../../firebase";
import { Section } from '../ui/Section';
import { ArrowRight, X, ExternalLink, Activity, Play, Zap, Terminal, ShieldCheck, BookOpen, Trophy, Calendar, RefreshCw, Layers, GitCommit, Cpu } from 'lucide-react';
import { VARIANTS, EASING } from '../../lib/motion-presets';
import { cn } from '../../lib/utils';
import { formatDate } from "../../lib/firebase-utils";

// ============================================================================
// HELPER: Interactive Holographic 3D Mouse-Tilt Panel
// ============================================================================
const HolographicCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(0);
  const [glowY, setGlowY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Smooth angle mapping
    const rY = ((mouseX / width) - 0.5) * 10;
    const rX = (0.5 - (mouseY / height)) * 10;
    
    setRotateX(rX);
    setRotateY(rY);
    setGlowX(mouseX);
    setGlowY(mouseY);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotateX(0);
        setRotateY(0);
      }}
      onClick={onClick}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
        willChange: "transform"
      }}
    >
      {/* 3D Glowing Shimmer Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-[32px] overflow-hidden"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 240px at ${glowX}px ${glowY}px, rgba(0, 194, 255, 0.14), transparent 80%)`
        }}
      />
      {children}
    </div>
  );
};

type TabId = 'prototypes' | 'publications' | 'logs';

export const ResearchExperimentsSection = () => {
  const [activeTab, setActiveTab] = useState<TabId>('prototypes');
  const [experiments, setExperiments] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  
  const [loadingExps, setLoadingExps] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  
  const [selectedExperiment, setSelectedExperiment] = useState<any>(null);

  // 3D Perspective Scroll Container Reference
  const sectionRef = useRef<HTMLDivElement>(null);

  // 3D Perspective Scroll transformations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 22 });

  const rotateXSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [8, 0, 0, -8]);
  const translateYSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [50, 0, 0, -50]);
  const scaleSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [0.96, 1, 1, 0.96]);
  const opacitySection = useTransform(smoothScroll, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // 1. Fetch Experiments
  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExperiments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingExps(false);
    }, (error) => {
      console.error("Firestore error loading experiments:", error);
      setLoadingExps(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Publications
  useEffect(() => {
    const q = query(collection(db, "blogPosts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((post: any) => post.published !== false)
        .sort((a: any, b: any) => {
          const getMillis = (date: any) => {
            if (!date) return 0;
            if (typeof date.toMillis === 'function') return date.toMillis();
            if (typeof date.toDate === 'function') return date.toDate().getTime();
            if (date.seconds) return date.seconds * 1000;
            if (date._seconds) return date._seconds * 1000;
            const parsed = new Date(date).getTime();
            return isNaN(parsed) ? 0 : parsed;
          };
          return getMillis(b.createdAt) - getMillis(a.createdAt);
        })
        .slice(0, 3);
      
      setPosts(data);
      setLoadingPosts(false);
    }, (error) => {
      console.error("Firestore error loading posts:", error);
      setLoadingPosts(false);
    });
    return () => unsubscribe();
  }, []);

  // 3. Fetch Build Logs
  useEffect(() => {
    const q = query(collection(db, "updates"), orderBy("date", "desc"), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingLogs(false);
    }, (error) => {
      console.error("Firestore error loading updates:", error);
      setLoadingLogs(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Section 
      id="research-workspace" 
      glowVariant="center" 
      className="py-24 md:py-32 border-t border-white/[0.08] bg-[#0A0A0B] relative overflow-hidden"
    >
      {/* Cybernetic Micro-Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-60 z-0" />
      
      {/* Projection Cyber Glow Source */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 rounded-full filter blur-[120px] pointer-events-none z-0 animate-pulse" />

      <div ref={sectionRef} className="w-full h-full relative z-10" style={{ perspective: 1200 }}>
        <motion.div 
          style={{ rotateX: rotateXSection, y: translateYSection, scale: scaleSection, opacity: opacitySection, transformStyle: "preserve-3d" }}
          className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        >
        
        {/* Section Header */}
        <div className="section-header max-w-3xl text-center mx-auto mb-16 flex flex-col items-center">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="badge shadow-[0_0_20px_rgba(0,194,255,0.08)] bg-white/[0.02] border border-white/[0.08] text-[10px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-1.5 px-4 py-2 rounded-full"
          >
            <Activity size={12} className="text-brand-primary animate-pulse" /> Ecosystem Intelligence Layer
          </motion.div>
          <motion.h2 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-4xl md:text-5.5xl font-black tracking-tight text-white mt-6 leading-[1.1]"
          >
            Active Research & <span className="text-brand-primary font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.28)' }}>Experiments.</span>
          </motion.h2>
          <motion.p 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-white/40 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto mt-6"
          >
            Unified dashboard of active cybernetic prototypes, deep-tech publications, and compiled laboratory logs.
          </motion.p>
        </div>

        {/* Tab Controls (Sleek Mechanical Toggles) */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white/[0.02] border border-white/[0.08] rounded-full p-1.5 backdrop-blur-md">
            {[
              { id: 'prototypes', label: 'Active Prototypes', icon: <Cpu size={14} /> },
              { id: 'publications', label: 'Research Papers', icon: <BookOpen size={14} /> },
              { id: 'logs', label: 'Build Logs & Chronology', icon: <Terminal size={14} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer relative",
                  activeTab === tab.id
                    ? "text-black"
                    : "text-white/40 hover:text-white/70"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="rd-tab-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-white rounded-full"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.icon} {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Display Area */}
        <div className="relative min-h-[480px]">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: ACTIVE PROTOTYPES */}
            {activeTab === 'prototypes' && (
              <motion.div
                key="prototypes"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASING.PREMIUM as any }}
                className="grid md:grid-cols-2 gap-8"
              >
                {loadingExps ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-[#0D0D0E] rounded-[32px] aspect-video w-full" />
                  ))
                ) : experiments.map((exp, i) => {
                  const phaseStatus = exp.status || (exp.featured ? "Live / Scale" : "Active R&D");
                  const statusColorClass = 
                    phaseStatus.includes("Live") ? "text-green-400 bg-green-400/10 border-green-400/20" :
                    phaseStatus.includes("Beta") ? "text-brand-primary bg-brand-primary/10 border-brand-primary/20" :
                    "text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20";

                  return (
                    <HolographicCard
                      key={exp.id}
                      onClick={() => setSelectedExperiment(exp)}
                      className="group relative cursor-pointer bg-[#0D0D0E]/40 backdrop-blur-xl border border-white/[0.08] hover:border-brand-primary/30 rounded-[32px] overflow-hidden flex flex-col h-full shadow-[0_20px_50px_rgba(0,0,0,0.55)] cursor-pointer"
                    >
                      {/* Thumbnail Cover */}
                      <div className="aspect-[16/9] w-full overflow-hidden bg-black/40 border-b border-white/[0.08] relative">
                        <img 
                          src={exp.image} 
                          alt={exp.title} 
                          loading="lazy" 
                          className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        {/* Status Pills */}
                        <div className="absolute top-6 left-6 flex items-center gap-2">
                          <span className={cn("px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border", statusColorClass)}>
                            {phaseStatus}
                          </span>
                          <span className="px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-white/50 border border-white/[0.08]">
                            {exp.category || "Prototype"}
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-brand-primary transition-colors">
                            {exp.title}
                          </h3>
                          <ArrowRight className="-rotate-45 text-white/20 group-hover:text-brand-primary transition-colors" size={20} />
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed mb-6 font-medium line-clamp-2">
                          {exp.problem || exp.description}
                        </p>
                        
                        <div className="mt-auto pt-6 border-t border-white/[0.08] flex flex-wrap gap-1.5">
                          {exp.tech?.slice(0, 3).map((tag: string) => (
                            <span 
                              key={tag} 
                              className="px-2.5 py-1 rounded bg-white/[0.02] border border-white/[0.08] text-[9px] font-mono text-white/30 uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </HolographicCard>
                  );
                })}
              </motion.div>
            )}

            {/* TAB 2: TECHNICAL PAPERS */}
            {activeTab === 'publications' && (
              <motion.div
                key="publications"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASING.PREMIUM as any }}
                className="grid md:grid-cols-3 gap-8"
              >
                {loadingPosts ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-[#0D0D0E] rounded-[32px] aspect-[4/3] w-full" />
                  ))
                ) : posts.map((post, i) => (
                  <HolographicCard
                    key={post.id}
                    className="group bg-[#0D0D0E]/40 backdrop-blur-xl border border-white/[0.08] hover:border-brand-primary/30 rounded-[32px] overflow-hidden transition-all duration-500 flex flex-col h-full shadow-[0_20px_50px_rgba(0,0,0,0.55)] cursor-pointer"
                  >
                    <Link to={`/blog/${post.slug || post.id}`} className="flex flex-col h-full w-full">
                      <div className="aspect-video relative overflow-hidden bg-white/[0.02] border-b border-white/[0.08]">
                        {post.coverImage ? (
                          <img 
                            src={post.coverImage} 
                            alt={post.title} 
                            loading="lazy" 
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-102 group-hover:opacity-100 transition-all duration-500" 
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="text-brand-primary font-bold opacity-50">Technical Paper</span>
                          </div>
                        )}
                        {post.category && (
                          <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-bold uppercase tracking-widest text-white/80 border border-white/[0.08]">
                            {post.category}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">
                          <Calendar size={12} className="text-brand-primary/60" /> {formatDate(post.createdAt)}
                        </div>
                        <h4 className="text-xl font-bold tracking-tight mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-3 flex-1 font-medium font-display">
                          {post.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between border-t border-white/[0.08] pt-6 text-[10px] font-bold uppercase tracking-widest text-brand-primary group-hover:text-white transition-colors">
                          Read Technical Paper <ArrowRight size={14} />
                        </div>
                      </div>
                    </Link>
                  </HolographicCard>
                ))}
              </motion.div>
            )}

            {/* TAB 3: LOGS & CHRONOLOGY TIMELINE */}
            {activeTab === 'logs' && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASING.PREMIUM as any }}
                className="w-full bg-[#070708]/40 backdrop-blur-xl border border-white/[0.08] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.55)] relative"
              >
                {/* Console Title bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.01]">
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                  <span className="text-[10px] font-mono tracking-[0.3em] text-white/30">INTELLIGENCE_DEPLOY_STREAM</span>
                  <div className="flex items-center gap-2">
                    <RefreshCw size={10} className="text-brand-primary animate-spin" />
                    <span className="text-[9px] font-mono text-brand-primary font-bold">MONITORING ACTIVE</span>
                  </div>
                </div>

                {/* Console Logs Stack */}
                <div className="p-6 md:p-8 font-mono text-xs divide-y divide-white/[0.08]">
                  {loadingLogs ? (
                    <div className="animate-pulse py-8 text-center text-white/20">Loading laboratory stream logs...</div>
                  ) : logs.map((log, i) => {
                    const tag = log.statusTag || 'Update';
                    const isShipped = tag === 'Shipped';
                    const isBuilding = tag === 'Building';
                    const isFix = tag === 'Fix';

                      return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="py-6 flex flex-col md:flex-row md:items-start gap-4 md:gap-8 hover:bg-white/[0.01] transition-colors px-4 rounded-[16px]"
                      >
                        {/* Status Badge */}
                        <div className="flex items-center gap-3 md:w-44 shrink-0">
                          <span className="text-[10px] text-white/20 font-bold shrink-0">{log.date}</span>
                          <span className={cn(
                            "text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border font-mono shrink-0",
                            isShipped ? "bg-green-500/5 text-green-400 border-green-500/25" :
                            isBuilding ? "bg-brand-primary/5 text-brand-primary border-brand-primary/25" :
                            isFix ? "bg-red-500/5 text-red-400 border-red-500/25" :
                            "bg-white/5 text-white/40 border-white/10"
                          )}>
                            {tag}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div className="flex-1 space-y-2">
                          <div className="text-sm font-bold text-white tracking-tight">{log.title}</div>
                          <div className="text-white/45 leading-relaxed text-[11px] font-medium tracking-wide">
                            {log.text}
                          </div>
                        </div>

                        {/* Related Node tag */}
                        {log.relatedProject && (
                          <div className="md:w-48 shrink-0 flex items-center md:justify-end gap-1.5 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
                            <Layers size={12} className="text-brand-primary/50" />
                            <span className="truncate">{log.relatedProject}</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Console Footer */}
                <div className="px-6 py-4 border-t border-white/[0.08] bg-white/[0.01] flex items-center justify-between text-[9px] font-mono text-white/20">
                  <span>TOTAL_RECORDS: {logs.length}</span>
                  <span>SYSTEM_TIME: {new Date().toISOString()}</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        </motion.div>
      </div>

      {/* Case Study Detailed Modal Overlay (Preserves same feature from original Experiments Section!) */}
      <AnimatePresence>
        {selectedExperiment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8 bg-[#0A0A0A]/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ ease: EASING.PREMIUM as any, duration: 0.4 }}
              className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-[#0C0D0E]/90 backdrop-blur-xl border border-white/[0.08] rounded-[32px] shadow-2xl no-scrollbar z-[501]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedExperiment(null)}
                className="absolute top-6 right-6 z-[600] w-12 h-12 rounded-full bg-black/60 border border-white/[0.08] flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
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
                  <span className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4 block">
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
                        <span className="w-10 h-10 rounded-xl bg-blend-lighten bg-brand-primary/10 flex items-center justify-center text-brand-primary text-sm font-bold border border-brand-primary/20 italic">01</span>
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
                        <span className="w-10 h-10 rounded-xl bg-blend-lighten bg-brand-primary/10 flex items-center justify-center text-brand-primary text-sm font-bold border border-brand-primary/20 italic">03</span>
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
                    <div className="bg-white/[0.01] border border-white/[0.08] p-10 rounded-[32px]">
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
                              <span className="text-brand-primary">{stat.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${stat.val}%` }}
                                transition={{ duration: 1.5, ease: EASING.PREMIUM as any }}
                                className="h-full bg-brand-primary shadow-[0_0_15px_rgba(0,194,255,0.4)]"
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
                        className="flex items-center justify-center gap-3 w-full py-6 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-black transition-all duration-500 group shadow-2xl"
                      >
                        Launch Interactive Node <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
export default ResearchExperimentsSection;
