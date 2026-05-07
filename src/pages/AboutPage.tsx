import React, { useRef, useState, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Zap, 
  Database, 
  Layout, 
  Layers, 
  Code,
  Box,
  BrainCircuit,
  Rocket,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Section } from '../components/ui/Section';
import { MagneticButton } from '../components/ui/MagneticButton';
import { VARIANTS, EASING } from '../lib/motion-presets';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { db, doc, getDoc } from '../firebase';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden pt-32 pb-24 isolate">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(0,194,255,0.05),transparent_70%)] -z-10" />
      
      <div className="w-full max-w-5xl mx-auto px-6 text-center">
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center"
        >
          <motion.div variants={VARIANTS.fadeUp} className="badge mb-8 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="tracking-[0.2em]">Company / Vision</span>
          </motion.div>

          <motion.h1 variants={VARIANTS.fadeUp} className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[1.05] mb-8 max-w-4xl">
            <span className="sr-only">Ayush Paul</span>
            Building Digital Systems <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">
              For The Future.
            </span>
          </motion.h1>

          <motion.p variants={VARIANTS.fadeUp} className="text-lg md:text-2xl text-white/50 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
            We architect and engineer high-performance platforms, automation frameworks, and intelligent tools that scale.
          </motion.p>

          <motion.div variants={VARIANTS.fadeUp} className="flex flex-col sm:flex-row items-center gap-6">
            <MagneticButton>
              <a href="/#projects" className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                View Work
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="/#contact" className="px-10 py-5 glass-card border-white/10 rounded-full font-bold text-lg hover:bg-white/5 transition-colors flex items-center gap-3 group">
                Collaborate <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const FounderSection = () => {
  return (
    <Section id="founder" className="py-32 border-t border-white/5 bg-[#0A0A0A]/50">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="glass-card p-12 md:p-20 rounded-[40px] md:rounded-[64px] border-white/5 flex flex-col md:flex-row gap-16 items-center"
        >
          <div 
            className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-[32px] md:rounded-[48px] overflow-hidden bg-white/5 border border-white/10 relative"
            style={{ willChange: 'transform' }}
          >
            {/* Founder Portrait for Identity Trust */}
            <div className="w-full h-full relative">
              <img 
                src="/assets/founder.png" 
                alt="Ayush Paul - Founder" 
                decoding="async"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image is missing
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white/10 bg-white/5"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><path d="M4 14.71 12 2l1 10h7l-8 12.71-1-10H4z"/></svg></div>';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent" />
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-3xl font-bold mb-2 tracking-tight">Ayush Paul</h3>
              <p className="text-brand-primary text-sm font-bold uppercase tracking-[0.3em]">Founder & Builder</p>
            </div>
            <p className="text-xl text-white/60 leading-relaxed font-medium">
              Specialized in translating complex requirements into robust, scalable digital infrastructure. Focusing on the intersection of systems engineering, artificial intelligence, and high-end creative technology.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

const VisionMissionSection = () => {
  return (
    <Section id="vision" className="py-32">
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <motion.div 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="p-16 glass-card rounded-[48px] border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Layout size={120} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 mb-8 block">01 / Vision</span>
          <h3 className="text-4xl font-bold mb-6 tracking-tight leading-tight">To create the foundational tools that empower tomorrow's digital ecosystem.</h3>
        </motion.div>

        <motion.div 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="p-16 glass-card rounded-[48px] border-white/5 bg-gradient-to-bl from-white/[0.03] to-transparent relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Terminal size={120} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 mb-8 block">02 / Mission</span>
          <h3 className="text-4xl font-bold mb-6 tracking-tight leading-tight">Engineering production-ready systems, automation workflows, and high-signal interfaces today.</h3>
        </motion.div>
      </div>
    </Section>
  );
};

const MilestonesCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [milestones, setMilestones] = useState<Array<{ year: string; title: string; desc: string; image?: string }>>([
    { year: "2021", title: "National Level Science Exhibition", desc: "Recognized for foundational hardware engineering." },
    { year: "2022", title: "Technology Projects Initiation", desc: "Started developing comprehensive software solutions." },
    { year: "2023", title: "Automation Systems", desc: "Architected intelligent workflows and AI integrations." },
    { year: "2024", title: "Innovation Builds", desc: "Launched scalable web applications and platforms." },
    { year: "2025", title: "Digital Product Development", desc: "Leading the next wave of full-stack ecosystems." }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const CACHE_KEY = 'cache_milestones';
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 Hours

  useEffect(() => {
    // 1. Instant Load from Cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const isFresh = Date.now() - timestamp < CACHE_TTL;
        
        // Load cached data immediately
        setMilestones(data);
        
        // If fresh, we can skip the initial loading state
        if (isFresh) setIsLoading(false);
      } catch (err) {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    // 2. Silent Background Refresh
    const fetchMilestones = async () => {
      try {
        const docSnap = await getDoc(doc(db, "content", "milestones"));
        if (docSnap.exists() && docSnap.data().items && docSnap.data().items.length > 0) {
          const newData = docSnap.data().items;
          
          // Update State
          setMilestones(newData);
          
          // Update Cache
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: newData,
            timestamp: Date.now()
          }));
        } else {
          console.warn("CMS Sync: Milestones document empty or missing. Using fallbacks.");
        }
      } catch (error) {
        console.error("CMS Sync Error [Milestones]:", error);
        // We do nothing else, preserving the existing state (cached or hardcoded)
      } finally {
        setIsLoading(false);
      }
    };
    fetchMilestones();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <Section id="milestones" className="py-32 bg-[#0A0A0A]/50 border-y border-white/5 overflow-hidden">
      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": milestones.map((m, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": m.title,
            "description": m.desc,
            "datePublished": m.year
          }))
        })}
      </script>

      <div className="max-w-7xl mx-auto px-6 mb-16 flex items-end justify-between">
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 flex items-center gap-4">
            Milestones & Progress
            {isLoading && (
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" />
              </span>
            )}
          </h2>
          <p className="text-white/40 text-lg">A track record of continuous execution.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <button onClick={() => scroll('left')} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
            <ChevronLeft />
          </button>
          <button onClick={() => scroll('right')} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-6 md:px-12 pb-12 custom-scrollbar"
      >
        {milestones.map((m, i) => (
          <motion.div
            key={m.id || i}
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "snap-center shrink-0 w-[85vw] md:w-[600px] glass-card rounded-[40px] p-8 border-white/5 group hover:border-white/20 transition-all duration-500 relative overflow-hidden",
              isLoading && "opacity-40 grayscale"
            )}
          >
            {isLoading && <div className="absolute inset-0 bg-white/[0.02] animate-pulse pointer-events-none" />}
            <div className="w-full aspect-[16/9] bg-white/5 rounded-[24px] mb-8 overflow-hidden relative border border-white/5">
              {m.image ? (
                <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
            </div>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight pr-8">{m.title}</h3>
              <span className="text-sm font-bold text-brand-primary tracking-widest">{m.year}</span>
            </div>
            <p className="text-white/50 text-lg font-medium">{m.desc}</p>
          </motion.div>
        ))}
        
        <div className="snap-center shrink-0 w-[85vw] md:w-[600px] flex items-center justify-center p-8">
          <h3 className="text-4xl font-bold text-white/30 italic tracking-tighter">"This is just the beginning."</h3>
        </div>
      </div>
    </Section>
  );
};

const CoreCapabilities = () => {
  const capabilities = [
    { icon: <Code />, title: "Digital Product Development", desc: "End-to-end full-stack applications with scalable architecture." },
    { icon: <BrainCircuit />, title: "Automation & AI Systems", desc: "Intelligent agent workflows and process automation." },
    { icon: <Layout />, title: "Creative Media Production", desc: "High-fidelity visual experiences and interaction design." },
    { icon: <Rocket />, title: "Growth Infrastructure", desc: "Reliable backend systems and analytics platforms." }
  ];

  return (
    <Section id="capabilities" className="py-32">
      <div className="section-header">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Core Capabilities</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {capabilities.map((c, i) => (
          <motion.div
            key={i}
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 glass-card rounded-[32px] border-white/5 hover:bg-white/[0.02] transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-8">
              {c.icon}
            </div>
            <h3 className="text-xl font-bold mb-4 tracking-tight">{c.title}</h3>
            <p className="text-white/40 font-medium leading-relaxed">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const ImpactNumbers = () => {
  const numbers = [
    { val: "50+", label: "Projects Built" },
    { val: "15+", label: "Systems Developed" },
    { val: "20+", label: "Skills Mastered" },
    { val: "4+", label: "Years Creating" }
  ];

  return (
    <Section className="py-32 border-y border-white/5 bg-gradient-to-b from-[#0A0A0A] to-[#111]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
        {numbers.map((n, i) => (
          <motion.div
            key={i}
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-white">
              {n.val}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">
              {n.label}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const ValuesSection = () => {
  const values = [
    "Build Fast.",
    "Think Systems.",
    "Solve Real Problems.",
    "Design With Purpose.",
    "Learn Continuously."
  ];

  return (
    <Section className="py-32">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-brand-primary mb-16">Operating Philosophy</h2>
        <div className="space-y-6 md:space-y-8">
          {values.map((v, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tighter text-white/80 hover:text-white transition-colors"
            >
              {v}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const TechStackWall = () => {
  const stack = [
    "Python", "React", "TypeScript", "Node.js", "AI/LLMs", 
    "Vercel", "Firebase", "Figma", "Tailwind CSS", "ROS", 
    "Arduino", "Embedded C++"
  ];

  return (
    <Section className="py-32 border-t border-white/5 bg-[#0A0A0A]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Technology Arsenal</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto px-6">
        {stack.map((tech, i) => (
          <motion.div
            key={i}
            variants={VARIANTS.scaleUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="px-8 py-4 rounded-full glass-card border-white/10 text-white/60 font-bold text-sm tracking-wide hover:text-white hover:border-white/30 transition-all cursor-default"
          >
            {tech}
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const ProblemSection = () => {
  const problems = [
    "Digital creators lack scalable systems.",
    "Businesses struggle with automation adoption.",
    "Innovation tools remain inaccessible.",
    "Talent exists but execution systems are missing."
  ];

  return (
    <Section className="py-32">
      <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
        <motion.div variants={VARIANTS.fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 leading-tight">
            The Problem
          </h2>
          <div className="space-y-6">
            {problems.map((p, i) => (
              <motion.div
                key={i}
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 text-white/70 font-medium text-xl md:text-2xl"
              >
                <div className="mt-2 w-2 h-2 rounded-full bg-brand-secondary shrink-0 shadow-[0_0_10px_rgba(255,0,60,0.8)]" />
                <p>{p}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div 
          variants={VARIANTS.fadeUp} 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }}
          className="aspect-square glass-card rounded-[48px] border-white/5 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-brand-secondary/5 to-transparent"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,60,0.1),transparent_50%)]" />
          <Box size={120} className="text-brand-secondary/20 stroke-[1px]" />
        </motion.div>
      </div>
    </Section>
  );
};

const SolutionSection = () => {
  const approaches = [
    { title: "Systems First", desc: "Building reusable, scalable infrastructure." },
    { title: "Automation Driven", desc: "Removing friction through AI and intelligent workflows." },
    { title: "Design + Technology", desc: "Merging deep engineering with premium aesthetics." },
    { title: "Scalable Infrastructure", desc: "Architecture designed to handle massive growth." }
  ];

  return (
    <Section className="py-32 border-t border-white/5 bg-[#0A0A0A]/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="section-header max-w-2xl text-left mx-0 items-start">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Our Approach</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approaches.map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 glass-card rounded-3xl border-white/5"
            >
              <h3 className="text-xl font-bold mb-3 tracking-tight text-white">{item.title}</h3>
              <p className="text-white/40 font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const FounderPhilosophySection = () => {
  const philosophies = [
    "Build systems, not tasks.",
    "Technology should multiply human potential.",
    "Speed beats perfection.",
    "Learning is a permanent advantage.",
    "Innovation comes from execution."
  ];

  return (
    <Section className="py-40">
      <div className="max-w-5xl mx-auto text-center px-6">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-16">Founder Philosophy</h2>
        <div className="space-y-8 md:space-y-12">
          {philosophies.map((p, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white/50 hover:text-white transition-colors duration-500 cursor-default"
            >
              {p}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const MarketVisionSection = () => {
  return (
    <Section className="py-32 border-t border-white/5 bg-gradient-to-br from-[#0A0A0A] to-[#0A0A0A]/50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center px-6">
        <motion.div variants={VARIANTS.fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">The Opportunity Ahead</h2>
          <p className="text-xl text-white/50 leading-relaxed font-medium mb-8 max-w-md">
            We are positioning ourselves inside a massive, rapidly growing wave of technological transformation.
          </p>
        </motion.div>
        <div className="space-y-4">
          {[
            "Rise of creator economy",
            "AI automation adoption",
            "Digital-first businesses",
            "Independent builders ecosystem"
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 md:p-8 glass-card rounded-[24px] border-white/5 flex items-center justify-between group hover:border-brand-primary/20 transition-all"
            >
              <span className="text-xl md:text-2xl font-bold tracking-tight text-white/80 group-hover:text-white">{item}</span>
              <ArrowUpRight className="text-white/20 group-hover:text-brand-primary transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const EcosystemModelSection = () => {
  return (
    <Section className="py-32">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-20">Ecosystem We Are Building</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary/10 via-brand-primary/50 to-brand-primary/10 -translate-y-1/2 z-0" />
          
          {[
            { title: "Creators", sub: "Ideas", icon: <BrainCircuit /> },
            { title: "Executors", sub: "Skills", icon: <Terminal /> },
            { title: "Platform", sub: "Execution", icon: <Layers /> },
            { title: "Outcome", sub: "Scalable Innovation", icon: <Rocket />, active: true }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative z-10 w-full md:w-56 p-8 rounded-[32px] glass-card flex flex-col items-center border",
                item.active ? "border-brand-primary/50 bg-brand-primary/5" : "border-white/5 bg-[#0A0A0A]"
              )}
            >
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-6", item.active ? "bg-brand-primary text-black" : "bg-white/5 text-white/50")}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">{item.title}</h3>
              <p className={cn("text-xs font-bold uppercase tracking-[0.2em]", item.active ? "text-brand-primary" : "text-white/30")}>{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const MomentumSection = () => {
  const momentum = [
    "Growing personal brand",
    "Product experimentation",
    "Technology projects",
    "Community building",
    "Platform development"
  ];

  return (
    <Section className="py-32 border-t border-white/5 bg-[#0A0A0A]/50">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-16 justify-between items-center">
        <motion.div variants={VARIANTS.fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="max-w-md">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">Building Momentum</h2>
          <p className="text-xl text-white/50 font-medium leading-relaxed">
            Consistent execution creates compounding results. We are actively pushing boundaries and increasing our footprint.
          </p>
        </motion.div>
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {momentum.map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 glass-card rounded-[20px] border-white/5 flex items-center gap-4"
            >
              <div className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(123,97,255,0.8)]" />
              <span className="font-bold tracking-tight text-white/80">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const InvestorRoadmapSection = () => {
  const phases = [
    { title: "Foundation", sub: "Projects & Systems" },
    { title: "Products", sub: "Tools & Platforms" },
    { title: "Scale", sub: "Automation Ecosystem" },
    { title: "Global Expansion", sub: "Collaboration Network" }
  ];

  return (
    <Section className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">Strategic Roadmap</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 glass-card rounded-[32px] border-white/5 flex flex-col justify-between min-h-[240px] group hover:border-brand-primary/30 transition-all"
            >
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 group-hover:text-brand-primary transition-colors">Phase {i + 1}</span>
              <div>
                <h3 className="text-3xl font-extrabold tracking-tight mb-2">{phase.title}</h3>
                <p className="text-white/40 font-medium">{phase.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const InvestorCTASection = () => {
  return (
    <Section className="py-40 text-center relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,rgba(0,194,255,0.08),transparent_70%)] -z-10" />
      <motion.div
        variants={VARIANTS.fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-6"
      >
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-tight">
          Open to <br className="hidden md:block" /> Collaboration.
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-16">
          <MagneticButton>
            <a href="/#contact" className="px-12 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_20px_40px_rgba(255,255,255,0.1)] block w-full sm:w-auto">
              Partner With Us
            </a>
          </MagneticButton>
          <MagneticButton>
            <a href="/#contact" className="px-12 py-5 glass-card border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-colors block w-full sm:w-auto">
              Collaborate
            </a>
          </MagneticButton>
          <MagneticButton>
            <a href="/#contact" className="px-12 py-5 glass-card border-white/10 rounded-full font-bold text-lg hover:bg-white/5 transition-colors block w-full sm:w-auto text-white/50">
              Explore Opportunities
            </a>
          </MagneticButton>
        </div>
      </motion.div>
    </Section>
  );
};

const JourneyTimeline = () => {
  const steps = [
    { label: "Phase 1", title: "Technology Foundations", desc: "Started building deep technical expertise and foundational projects." },
    { label: "Phase 2", title: "Freelance Innovation", desc: "Executed complex client projects and independent builds." },
    { label: "Phase 3", title: "System Architecture", desc: "Focus shifted to scalable product and system development." },
    { label: "Phase 4", title: "Startup Ecosystem", desc: "Launching high-impact digital platforms and automation tools." }
  ];

  return (
    <Section className="py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">The Journey</h2>
      </div>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-white/10 z-0" />
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-full glass-card border border-white/20 bg-[#0A0A0A] flex items-center justify-center text-sm font-bold text-white/50 group-hover:text-brand-primary group-hover:border-brand-primary/50 transition-colors mb-8 shadow-xl">
                {step.label}
              </div>
              <h3 className="text-xl font-bold mb-4 tracking-tight">{step.title}</h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed max-w-[200px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

import { FeaturedProjectsSection } from '../components/sections/FeaturedProjectsSection';

export const AboutPage = () => {
  useSEO({
    title: "About Ayush Paul | Senior AI Developer & Full Stack Engineer",
    description: "Discover the journey, skills, and vision of Ayush Paul, a specialist in AI automation and high-performance digital engineering.",
    keywords: "Ayush Paul, Ayush Paul Bio, Ayush Paul Experience, AI Developer India"
  });

  return (
    <div className="w-full bg-[#0A0A0A] overflow-x-hidden pt-[env(safe-area-inset-top,0px)]">
      <HeroSection />
      <FounderSection />
      <VisionMissionSection />
      <MilestonesCarousel />
      <CoreCapabilities />
      <JourneyTimeline />
      <ImpactNumbers />
      <ProblemSection />
      <SolutionSection />
      <FounderPhilosophySection />
      <MarketVisionSection />
      <EcosystemModelSection />
      <MomentumSection />
      <InvestorRoadmapSection />
      <TechStackWall />
      <ValuesSection />
      <FeaturedProjectsSection filter={null} />
      <InvestorCTASection />
    </div>
  );
};
