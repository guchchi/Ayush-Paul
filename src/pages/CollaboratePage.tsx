import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Code, 
  Cpu, 
  Layout, 
  Sparkles, 
  ChevronRight,
  Github,
  Linkedin,
  Youtube,
  FileText,
  Mail,
  TrendingUp,
  Workflow,
  Globe,
  Layers,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { Section } from '../components/ui/Section';
import { MagneticButton } from '../components/ui/MagneticButton';
import { VARIANTS, EASING } from '../lib/motion-presets';
import { db, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from '../firebase';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

// --- Components ---

const Hero = () => (
  <Section className="pt-32 pb-20 overflow-hidden" glowVariant="hero">
    <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
      <motion.div 
        variants={VARIANTS.fadeUp}
        initial="initial"
        animate="animate"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-[0.3em]"
      >
        <Sparkles size={14} className="animate-pulse" />
        Open for Collaboration
      </motion.div>
      
      <motion.h1 
        variants={VARIANTS.fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
        className="text-[clamp(3rem,12vw,7.5rem)] font-extrabold tracking-tighter leading-[0.85] mb-8"
      >
        Let’s Build Something <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-white/40 italic">Meaningful</span> Together.
      </motion.h1>

      <motion.div 
        variants={VARIANTS.fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4 text-sm md:text-lg font-bold uppercase tracking-widest text-white/30"
      >
        {["Startups", "Founders", "Companies", "Creators"].map((item, i) => (
          <React.Fragment key={item}>
            <span className="hover:text-brand-primary transition-colors duration-300">{item}</span>
            {i < 3 && <span className="opacity-20">•</span>}
          </React.Fragment>
        ))}
      </motion.div>

      <motion.div 
        variants={VARIANTS.fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12"
      >
        <MagneticButton>
          <button 
            onClick={() => document.getElementById('collaboration-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-12 py-6 bg-white text-black rounded-[24px] font-bold text-xl flex items-center gap-3 group shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform"
          >
            👉 Start Collaboration <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </MagneticButton>
        
        <button 
          onClick={() => window.location.href = "mailto:hello.ayushpaul.in?subject=Discovery%20Call%20Request"}
          className="px-12 py-6 glass-card border-white/10 text-white rounded-[24px] font-bold text-xl hover:bg-white/5 transition-all flex items-center gap-2 group"
        >
          Book Discovery Call <Zap size={20} className="text-brand-primary group-hover:animate-pulse" />
        </button>
      </motion.div>

      <motion.div
        variants={VARIANTS.fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4 }}
        className="pt-16 flex items-center justify-center gap-3"
      >
        <div className="flex -space-x-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-white/10 overflow-hidden">
               <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" className="w-full h-full object-cover grayscale opacity-50" />
            </div>
          ))}
        </div>
        <div className="text-left">
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Current Capacity: 1 Slot Open</div>
          <div className="text-xs text-white/40 font-medium">Joined by 15+ Visionary Founders</div>
        </div>
      </motion.div>
    </div>
  </Section>
);

const EcosystemMarquee = () => {
  const logos = [
    { name: "OpenAI", url: "https://cdn.simpleicons.org/openai/white" },
    { name: "Vercel", url: "https://cdn.simpleicons.org/vercel/white" },
    { name: "Firebase", url: "https://cdn.simpleicons.org/firebase/white" },
    { name: "GitHub", url: "https://cdn.simpleicons.org/github/white" },
    { name: "Next.js", url: "https://cdn.simpleicons.org/nextdotjs/white" },
    { name: "AWS", url: "https://cdn.simpleicons.org/amazonwebservices/white" },
    { name: "Supabase", url: "https://cdn.simpleicons.org/supabase/white" },
    { name: "Stripe", url: "https://cdn.simpleicons.org/stripe/white" },
    { name: "Tailwind CSS", url: "https://cdn.simpleicons.org/tailwindcss/white" },
  ];

  // Duplicate for seamless loop
  const displayLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full py-12 border-b border-white/5 bg-white/[0.01] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
         <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Infrastructure Ecosystem</p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="flex whitespace-nowrap gap-16 md:gap-32 items-center animate-marquee group-hover:[animation-play-state:paused]">
          {displayLogos.map((logo, i) => (
            <div key={i} className="flex items-center gap-4 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-default">
              <img src={logo.url} alt={logo.name} className="h-6 md:h-7 w-auto object-contain" />
              <span className="text-xl md:text-2xl font-bold tracking-tighter font-display text-white/60">{logo.name}</span>
            </div>
          ))}
        </div>

        {/* Gradient overlays for smooth fading edges */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};

const PhilosophySection = () => {
  const pillars = [
    { 
      title: "Architecture First.", 
      desc: "Code is temporary; systems are permanent. I design for longevity, scalability, and seamless handoffs." 
    },
    { 
      title: "Signal Over Noise.", 
      desc: "In a world of features, I prioritize the critical 20% that drives 80% of the user value and impact." 
    },
    { 
      title: "Speed as a Feature.", 
      desc: "Shipping fast isn't about rushing; it's about focus. I build engines that turn intent into reality in weeks, not months." 
    },
    { 
      title: "Radical Transparency.", 
      desc: "Iterating in public is the fastest path to product-market fit. Build, ship, listen, and evolve—fast." 
    }
  ];

  return (
    <Section className="py-40 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mb-32">
          <motion.h2 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold tracking-tighter leading-[0.95] mb-12"
          >
            A Philosophy of <br />
            <span className="text-brand-primary italic">High-Signal</span> Building.
          </motion.h2>
          <motion.p 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-white/40 font-medium leading-relaxed"
          >
            I don't just build products; I partner with founders to architect ecosystems that solve real problems with precision and speed.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-20 gap-y-32">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASING.PREMIUM as any }}
              className="space-y-6 group"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-primary mb-4">Pillar 0{i + 1}</div>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tighter group-hover:text-brand-primary transition-colors duration-500">
                {pillar.title}
              </h3>
              <p className="text-xl text-white/40 font-medium leading-relaxed max-w-md">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const MetricsBar = () => {
  const metrics = [
    { label: "Products Built", value: "12+", icon: <Layers size={20} /> },
    { label: "Lines of Logic", value: "250k+", icon: <Code size={20} /> },
    { label: "User Impact", value: "50k+", icon: <Globe size={20} /> },
    { label: "Ship Speed", value: "7 Days", icon: <Rocket size={20} /> }
  ];

  return (
    <Section className="py-20 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-4"
            >
              <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-primary border border-white/5 mb-4">
                {m.icon}
              </div>
              <div className="text-4xl font-extrabold tracking-tighter">{m.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const ExpertiseGrid = () => {
  const expertise = [
    { title: "Product Development", desc: "End-to-end architecture from discovery to deployment.", icon: <Layers className="text-brand-primary" /> },
    { title: "AI Automation", desc: "LLM integrations and autonomous agent workflows.", icon: <Cpu className="text-brand-secondary" /> },
    { title: "Website Systems", desc: "High-performance, scalable web infrastructures.", icon: <Globe className="text-brand-accent" /> },
    { title: "Startup MVPs", desc: "Rapid prototyping and shipping at startup speed.", icon: <Rocket className="text-orange-400" /> },
    { title: "Growth Systems", desc: "Content engineering and distribution automation.", icon: <TrendingUp className="text-green-400" /> }
  ];

  return (
    <Section className="py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">Expertise</h2>
          <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">What I Can <span className="text-brand-primary">Help With.</span></h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertise.map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 glass-card rounded-[32px] border-white/5 group hover:border-brand-primary/20 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <h4 className="text-2xl font-bold mb-4 tracking-tight">{item.title}</h4>
              <p className="text-white/40 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const CollaborationTypes = () => {
  const types = [
    { type: "Freelance Projects", for: "Companies", desc: "Strategic engineering for high-impact milestones.", badge: "Project-Based" },
    { type: "Startup Collaboration", for: "Founders", desc: "Joining forces to build the next big thing.", badge: "Equity / Partnership" },
    { type: "Internship / Roles", for: "Recruiters", desc: "Deep-diving into complex technical ecosystems.", badge: "Full-time / Lead" },
    { type: "Speaking / Teaching", for: "Institutions", desc: "Sharing insights on AI, Robotics, and Building.", badge: "Engagement" }
  ];

  return (
    <Section className="py-32 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">Engagement Models</h2>
          <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">How We <span className="text-brand-secondary">Collaborate.</span></h3>
        </div>

        <div className="grid gap-6">
          {types.map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 glass-card rounded-[40px] border-white/5 hover:bg-white/[0.04] transition-all group"
            >
              <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xl font-bold">
                  0{i + 1}
                </div>
                <div>
                  <h4 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-brand-primary transition-colors">{item.type}</h4>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-white/40 font-medium">For:</span>
                    <span className="text-white/80 font-bold">{item.for}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 md:mt-0 flex flex-col items-center md:items-end gap-4">
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  {item.badge}
                </span>
                <p className="text-white/30 text-sm font-medium max-w-xs text-center md:text-right">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const FeaturedProof = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (projects.length === 0 && !isLoading) return null;

  return (
    <Section className="py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-end mb-20">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">Proof of Work</h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">Featured <span className="text-brand-accent">Showcase.</span></h3>
          </div>
          <Link to="/projects" className="hidden md:flex items-center gap-2 text-white/40 hover:text-brand-primary font-bold tracking-widest uppercase text-xs transition-colors">
            View All Projects <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative glass-card rounded-[32px] overflow-hidden border-white/5"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                <p className="text-white/40 text-sm line-clamp-2 font-medium mb-6">{project.vision || project.description}</p>
                <Link to={`/projects/${project.slug || project.id}`} className="text-brand-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  Explore Project <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const MomentumBoard = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "updates"), orderBy("date", "desc"), limit(8));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUpdates(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (updates.length === 0 && !isLoading) return null;

  return (
    <Section className="py-32 border-t border-white/5 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" /> Live Momentum
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">The Founder’s <span className="text-brand-primary italic">Console.</span></h3>
          </div>
          <p className="text-white/40 font-medium max-w-sm text-lg">
            Real-time deployment logs, engineering sprints, and product upgrades from my building floor.
          </p>
        </div>

        <div className="space-y-4">
          {updates.map((update, i) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 md:p-8 glass-card border-white/5 hover:border-brand-primary/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start md:items-center gap-6 flex-1">
                <div className="hidden md:block w-24 text-[10px] font-bold uppercase tracking-widest text-white/20 shrink-0">
                  {update.date}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded border",
                      update.statusTag === 'Shipped' ? "text-green-500 border-green-500/20 bg-green-500/5" :
                      update.statusTag === 'Building' ? "text-brand-primary border-brand-primary/20 bg-brand-primary/5" :
                      "text-white/30 border-white/10 bg-white/5"
                    )}>
                      {update.statusTag || 'LOG'}
                    </span>
                    <h4 className="text-xl font-bold tracking-tight text-white/90">{update.title}</h4>
                  </div>
                  <p className="text-sm text-white/40 font-medium line-clamp-1">{update.text}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="md:hidden text-[10px] font-bold uppercase tracking-widest text-white/20">
                  {update.date}
                </div>
                {update.relatedProject && (
                  <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                    <Layers size={12} /> {update.relatedProject}
                  </div>
                )}
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                   <ChevronRight size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
           <p className="text-xs font-bold uppercase tracking-[0.5em] text-white/10 animate-pulse">Syncing with Live Ecosystem...</p>
        </div>
      </div>
    </Section>
  );
};

const TechStackSection = () => {
  const stack = [
    { name: "Frontend", tools: ["React", "Next.js", "TypeScript", "Tailwind"] },
    { name: "Backend", tools: ["Node.js", "Firebase", "Supabase", "PostgreSQL"] },
    { name: "AI/Intelligence", tools: ["OpenAI", "LangChain", "Pinecone", "Python"] },
    { name: "Infrastructure", tools: ["Vercel", "AWS", "Docker", "Git"] }
  ];

  return (
    <Section className="py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">The Engine</h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">My Startup <span className="text-brand-primary">Tech Stack.</span></h3>
          </div>
          <p className="text-white/40 font-medium max-w-sm text-lg">
            I use a battle-tested stack designed for maximum development velocity and production scale.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stack.map((cat, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 glass-card rounded-[32px] border-white/5"
            >
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-6">{cat.name}</h4>
              <div className="flex flex-wrap gap-3">
                {cat.tools.map(tool => (
                  <span key={tool} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-bold text-white/60">
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const ProcessSection = () => {
  const steps = [
    { title: "Discuss Idea", desc: "Aligning on vision, goals, and technical feasibility.", icon: <MessageSquare size={24} /> },
    { title: "Plan Execution", desc: "Architecting the roadmap and defining key milestones.", icon: <Workflow size={24} /> },
    { title: "Build Fast", desc: "Rapid development with a focus on core value and UX.", icon: <Code size={24} /> },
    { title: "Launch Public", desc: "Deploying to production and scaling impact.", icon: <Rocket size={24} /> }
  ];

  return (
    <Section className="py-32 bg-gradient-to-b from-[#0A0A0A] to-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">The Workflow</h2>
          <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">Startup-Style <span className="text-brand-primary italic">Process.</span></h3>
        </div>

        <div className="grid md:grid-cols-4 gap-4 md:gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-10 group"
            >
              {/* Connector line */}
              {i < 3 && (
                <div className="hidden md:block absolute top-1/2 left-[80%] w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent z-0" />
              )}
              
              <div className="relative z-10 space-y-8">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-brand-primary group-hover:text-black group-hover:border-brand-primary transition-all duration-500 shadow-xl">
                  {step.icon}
                </div>
                <div className="space-y-4">
                  <div className="text-xs font-bold text-brand-primary uppercase tracking-[0.3em]">Step 0{i + 1}</div>
                  <h4 className="text-2xl font-bold tracking-tight">{step.title}</h4>
                  <p className="text-white/30 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "Freelance Project",
    budgetRange: "$1k - $5k",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "collaboration_requests"), {
        ...formData,
        timestamp: serverTimestamp()
      });
      setStatus("success");
      setFormData({ name: "", email: "", projectType: "Freelance Project", budgetRange: "$1k - $5k", message: "" });
    } catch (error) {
      console.error("Error submitting request:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="collaboration-form" className="py-32" glowVariant="bottom">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={VARIANTS.scaleUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="glass-card p-8 md:p-20 rounded-[60px] border-white/10 shadow-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent opacity-50" />
          
          <div className="mb-16 text-center">
            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">Request Collaboration</h3>
            <p className="text-white/40 font-medium text-lg mb-8">Let's scope out your project and get started.</p>
            
            <div className="flex flex-wrap justify-center gap-4">
               {["NDA Ready", "Response < 24h", "Strategic Focus"].map((tag) => (
                 <div key={tag} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-primary/5 border border-brand-primary/10 text-[10px] font-bold uppercase tracking-widest text-brand-primary/60">
                   <CheckCircle2 size={12} /> {tag}
                 </div>
               ))}
            </div>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-lg font-medium"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@startup.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-lg font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Project Type</label>
                <select 
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-lg font-medium appearance-none"
                >
                  <option className="bg-[#0A0A0A]">Freelance Project</option>
                  <option className="bg-[#0A0A0A]">Startup MVP</option>
                  <option className="bg-[#0A0A0A]">Growth System</option>
                  <option className="bg-[#0A0A0A]">Speaking Engagement</option>
                  <option className="bg-[#0A0A0A]">Other Collaboration</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Budget Range</label>
                <select 
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-lg font-medium appearance-none"
                >
                  <option className="bg-[#0A0A0A]">$1k - $5k</option>
                  <option className="bg-[#0A0A0A]">$5k - $15k</option>
                  <option className="bg-[#0A0A0A]">$15k - $50k</option>
                  <option className="bg-[#0A0A0A]">$50k+</option>
                  <option className="bg-[#0A0A0A]">Partnership / Equity</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Message</label>
              <textarea 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your project, goals, and timeline..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all h-48 resize-none text-lg font-medium"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-7 bg-white text-black rounded-[24px] font-bold text-xl hover:bg-brand-primary hover:text-white transition-all disabled:opacity-50 shadow-2xl flex items-center justify-center gap-3 relative group overflow-hidden"
            >
              <span className="relative z-10">{isSubmitting ? 'Transmitting...' : 'Request Collaboration'}</span>
              <ArrowRight size={24} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-brand-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 text-green-400 font-bold bg-green-400/5 py-4 rounded-2xl border border-green-400/20"
                >
                  <CheckCircle2 size={24} /> Request sent successfully! I'll be in touch soon.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </Section>
  );
};

const TrustFooter = () => (
  <Section className="py-20 border-t border-white/5 bg-white/[0.01]">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="space-y-4 text-center md:text-left">
        <h4 className="text-sm font-bold uppercase tracking-[0.5em] text-white/20">Trust & Transparency</h4>
        <p className="text-xl font-bold text-white/60">Verified Identity. Proof of Work. Open Source.</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-6">
        {[
          { label: "GitHub", icon: <Github />, href: "https://github.com/guchchi" },
          { label: "LinkedIn", icon: <Linkedin />, href: "https://www.linkedin.com/in/paulayush/" },
          { label: "YouTube", icon: <Youtube />, href: "https://www.youtube.com/@ALX-17" },
          { label: "Resume", icon: <FileText />, href: "/resume.pdf" }
        ].map((link, i) => (
          <MagneticButton key={i}>
            <a 
              href={link.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 glass-card rounded-2xl border-white/5 hover:border-white/20 transition-all text-white/40 hover:text-white"
            >
              {link.icon}
              <span className="font-bold text-sm tracking-widest uppercase">{link.label}</span>
            </a>
          </MagneticButton>
        ))}
      </div>
    </div>
  </Section>
);

// --- Main Page ---

const NetworkAdvisoryHub = () => {
  const sections = [
    {
      title: "Active Collaborations",
      desc: "Partnering with high-conviction founders to build technical foundations for the next decade.",
      items: ["Early-Stage AI Startups", "Venture-Backed R&D Labs", "Product-Led Growth Teams"]
    },
    {
      title: "Advisory Focus",
      desc: "Strategic technical guidance for founders navigating the transition from MVP to Scale.",
      items: ["Technical Architecture", "System Automation", "Zero-to-One Engineering"]
    },
    {
      title: "Investment Interests",
      desc: "Deep-diving into industries where AI and Automation create radical structural shifts.",
      items: ["Autonomous Agents", "Educational Infrastructure", "Decentralized Systems"]
    }
  ];

  return (
    <Section className="py-40 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-white/20 mb-8">Ecosystem & Network</h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.95]">The <span className="text-brand-primary">Advisory</span> Layer.</h3>
          </div>
          <div className="max-w-md space-y-6">
            <p className="text-xl text-white/50 font-medium leading-relaxed">
              I maintain a highly selective network of founders and partners, focusing on projects where technical precision meets massive scale.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/5 border border-brand-primary/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Invitation Only Engagement</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-8"
            >
              <h4 className="text-2xl font-bold tracking-tight pb-6 border-b border-white/5">{section.title}</h4>
              <p className="text-white/40 font-medium leading-relaxed">{section.desc}</p>
              <ul className="space-y-4">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-white/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-32 p-12 glass-card rounded-[40px] border-white/5 text-center space-y-8 bg-brand-primary/[0.02]"
        >
          <h4 className="text-3xl font-bold tracking-tighter">Building with ambitious founders.</h4>
          <p className="text-white/40 max-w-xl mx-auto font-medium text-lg">
            I limit my active collaborations to 2 projects per quarter to ensure deep technical focus and strategic impact.
          </p>
          <MagneticButton>
            <button 
              onClick={() => document.getElementById('collaboration-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:bg-brand-primary hover:text-white transition-all shadow-2xl"
            >
              Apply for Collaboration
            </button>
          </MagneticButton>
        </motion.div>
      </div>
    </Section>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Who owns the Intellectual Property (IP)?",
      a: "You do. Full ownership and IP rights are transferred to you upon project completion. I build using clean, documented code and industry-standard repositories (GitHub/GitLab) so your technical team can take over seamlessly."
    },
    {
      q: "What is the typical timeline for an MVP?",
      a: "Speed is a feature. Most MVPs ship in 2 to 4 weeks. By utilizing my battle-tested 'Startup Engine'—a pre-built architecture for auth, database, and UI—we focus 100% of our time on your unique core value proposition."
    },
    {
      q: "How do you handle technical scaling?",
      a: "I architect for scale from Day 1. By leveraging serverless infrastructure (Vercel/AWS), edge computing, and optimized database schemas, your product can scale from 1 to 100k+ users without a complete rewrite."
    },
    {
      q: "What happens after the product is launched?",
      a: "Launch is just the beginning. I provide 30 days of complimentary 'Hyper-Care' to resolve any post-launch bugs. Afterward, we can discuss ongoing maintenance retainers or I can help you interview and transition to your first full-time hire."
    },
    {
      q: "Do you just build what I tell you to build?",
      a: "No. You're hiring a technical partner, not just a pair of hands. I challenge assumptions, suggest product improvements, and prioritize features based on user value and technical feasibility to ensure we build a product that actually wins."
    }
  ];

  return (
    <Section className="py-32 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">Founder Playbook</h2>
          <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">Common <span className="text-brand-primary">Questions.</span></h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={false}
              className={cn(
                "glass-card border-white/5 overflow-hidden transition-all duration-500",
                openIndex === i ? "border-brand-primary/20 bg-white/[0.04]" : "hover:border-white/20"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-8 flex items-center justify-between text-left group"
              >
                <span className="text-xl font-bold tracking-tight pr-8">{faq.q}</span>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border border-white/10 shrink-0 transition-transform duration-500",
                  openIndex === i ? "rotate-180 bg-brand-primary border-brand-primary text-black" : "group-hover:border-white/30"
                )}>
                  <ChevronRight size={20} className={cn("transition-transform", openIndex === i ? "rotate-90" : "")} />
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASING.PREMIUM as any }}
                  >
                    <div className="px-8 pb-8 text-white/50 font-medium text-lg leading-relaxed border-t border-white/5 pt-6">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};


export const CollaboratePage = () => {
  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen">
      <Hero />
      <MetricsBar />
      <EcosystemMarquee />
      <PhilosophySection />
      <ExpertiseGrid />
      <CollaborationTypes />
      <FeaturedProof />
      <MomentumBoard />
      <NetworkAdvisoryHub />
      <TechStackSection />
      <ProcessSection />
      <FAQSection />
      <ContactForm />
      <TrustFooter />
    </div>
  );
};

export default CollaboratePage;
