import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ExternalLink, 
  Github, 
  Code, 
  Cpu, 
  Zap, 
  Layout, 
  ArrowUpRight,
  ChevronRight,
  Maximize2,
  X,
  Target,
  Workflow,
  Sparkles,
  Search,
  Rocket,
  ShieldCheck,
  TrendingUp,
  History,
  Activity
} from 'lucide-react';
import { Section } from '../components/ui/Section';
import { MagneticButton } from '../components/ui/MagneticButton';
import { VARIANTS, EASING } from '../lib/motion-presets';
import { cn } from '../lib/utils';
import { db, collection, query, orderBy, onSnapshot } from '../firebase';

// --- Product Logic & Data ---
// Keep initial data as fallback
const INITIAL_PRODUCTS = [
  {
    id: "platform-x",
    title: "Ecosystem Alpha",
    category: "Infrastructure",
    status: "Live / Scale",
    statusColor: "text-green-400 bg-green-400/10",
    vision: "To become the decentralized nervous system for modern digital creators.",
    impact: "Automating cross-platform intelligence for 10k+ innovators.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
    tech: ["React", "TypeScript", "Redis"],
    metrics: { growth: "+45% MoM", efficiency: "92%", uptime: "99.9%" },
    evolution: [
      { v: "v1.0", date: "Q1 2024", note: "Core distribution engine launched." },
      { v: "v1.5", date: "Q2 2024", note: "Integrated AI execution layer." },
      { v: "v2.0", date: "Q3 2024", note: "Scaling to global agent networks." }
    ]
  },
  {
    id: "neural-core",
    title: "Neural Core",
    category: "AI Engine",
    status: "Beta Access",
    statusColor: "text-brand-primary bg-brand-primary/10",
    vision: "Standardizing the bridge between human intent and machine execution.",
    impact: "Processing 500k+ natural language requests into production-ready code.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000",
    tech: ["Python", "FastAPI", "OpenAI"],
    metrics: { accuracy: "98.5%", latency: "120ms", savings: "60%" },
    evolution: [
      { v: "Alpha", date: "Feb 2024", note: "Initial vector bridge POC." },
      { v: "Beta", date: "May 2024", note: "Open access for enterprise testing." }
    ]
  },
  {
    id: "nexus-ui",
    title: "Nexus System",
    category: "Design System",
    status: "Production",
    statusColor: "text-purple-400 bg-purple-400/10",
    vision: "Eliminating the friction between creative design and technical shipping.",
    impact: "Enabling teams to ship high-fidelity products 4x faster.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000",
    tech: ["Tailwind", "React", "Framer"],
    metrics: { devVelocity: "4.2x", consistency: "100%", themes: "50+" },
    evolution: [
      { v: "v0.1", date: "Jan 2024", note: "Token mapping system built." },
      { v: "v1.0", date: "Apr 2024", note: "Complete UI compiler released." }
    ]
  }
];

const FlagshipSection = () => {
  return (
    <Section className="pt-40 pb-24">
      <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div variants={VARIANTS.fadeUp} initial="initial" animate="animate">
          <div className="flex items-center gap-3 mb-8">
            <div className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary text-[10px] font-bold uppercase tracking-widest rounded-full border border-brand-secondary/20">
              Flagship Release
            </div>
            <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest">v2.0 Beta</div>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8">
            Ecosystem <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-white/40">Intelligence.</span>
          </h1>
          <p className="text-2xl text-white/50 font-medium leading-tight mb-12 max-w-xl">
            The world's first autonomous distribution layer for digital creators. Scale your impact without scaling your effort.
          </p>
          <div className="flex flex-wrap gap-6">
            <MagneticButton>
              <a href="#" className="px-10 py-5 bg-brand-primary text-black rounded-[24px] font-bold text-lg flex items-center gap-2 group">
                Request Access <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
            </MagneticButton>
            <button className="px-10 py-5 glass-card border-white/10 text-white rounded-[24px] font-bold text-lg hover:bg-white/5 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: EASING.PREMIUM as any }}
          className="relative aspect-square glass-card rounded-[64px] border-white/5 overflow-hidden shadow-2xl"
        >
          <img 
            src="/vision_technical_schematic.png" 
            alt="Ecosystem Intelligence Schematic" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </Section>
  );
};

import { Link } from 'react-router-dom';

const ProductCard = ({ product }: { product: any }) => {
  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="group relative bg-[#0A0A0A] border border-white/5 rounded-[48px] overflow-hidden hover:border-white/20 transition-all duration-700 shadow-2xl block"
    >
      <Link to={`/projects/${product.slug || product.id}`} className="block h-full">
        <div className="aspect-video overflow-hidden relative bg-white/[0.02]">
          <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-current opacity-80", product.statusColor)}>
              {product.status}
            </span>
            <span className="px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white/50 border border-white/10">
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-12">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-4xl font-extrabold tracking-tighter">{product.title}</h3>
            <ArrowUpRight className="text-white/20 group-hover:text-brand-primary transition-colors" />
          </div>
          
          <div className="space-y-8 mb-12">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block">Product Vision</span>
              <p className="text-lg text-white/70 font-medium leading-relaxed">{product.vision}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3 block">Impact Metric</span>
              <p className="text-lg text-brand-primary font-bold">{product.impact}</p>
            </div>
          </div>

          {/* Momentum Grid */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
            {product.metrics && Object.entries(product.metrics).map(([key, val]) => (
              <div key={key}>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 block mb-1">{key}</span>
                <span className="text-sm font-bold text-white/60">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const NowBuilding = () => {
  const activeDev = [
    { title: "Agentic Workflows", desc: "Building the next generation of autonomous task executors." },
    { title: "Vector Systems", desc: "R&D into localized high-speed embedding architectures." },
    { title: "Visual Logic", desc: "Experimental UI layers for complex system visualization." }
  ];

  return (
    <Section className="py-32 border-t border-white/5 bg-gradient-to-b from-[#0A0A0A] to-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
            <Activity size={24} className="animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold tracking-tighter">Active Development</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {activeDev.map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 glass-card rounded-[32px] border-white/5 space-y-6"
            >
              <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
              <p className="text-white/40 font-medium leading-relaxed">{item.desc}</p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-secondary tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-ping" />
                Live R&D
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const InnovationMetrics = () => {
  const metrics = [
    { icon: <TrendingUp />, label: "Development Velocity", val: "4.8x", note: "Above Industry Avg" },
    { icon: <ShieldCheck />, label: "System Reliability", val: "99.99%", note: "Zero Critical Failures" },
    { icon: <History />, label: "Iteration Cycle", val: "7 Days", note: "Ship to Production" },
    { icon: <Rocket />, label: "Deployment Reach", val: "Global", note: "Multi-Region Edge" }
  ];

  return (
    <Section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-white/20 mb-8">Momentum & Metrics</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">Innovation at the <span className="text-brand-primary">Edge of Scale.</span></h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
              <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40 mb-8 border border-white/5">
                {m.icon}
              </div>
              <div className="text-5xl font-extrabold tracking-tighter">{m.val}</div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-white/30">{m.label}</div>
              <p className="text-[10px] text-brand-primary font-bold tracking-widest">{m.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export const ProjectsPage = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const displayProducts = products.length > 0 ? products : INITIAL_PRODUCTS;

  return (
    <div className="w-full bg-[#0A0A0A] overflow-x-hidden min-h-screen">
      <FlagshipSection />
      
      <Section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-8">The Product Lineup</h2>
              <h3 className="text-5xl font-bold tracking-tighter">Our Core Systems.</h3>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {displayProducts.map((product) => {
              // Add dynamic status colors if missing
              const statusColorMap: Record<string, string> = {
                "Live / Scale": "text-green-400 bg-green-400/10",
                "Beta Access": "text-brand-primary bg-brand-primary/10",
                "Production": "text-purple-400 bg-purple-400/10",
                "R&D": "text-yellow-400 bg-yellow-400/10",
                "In Development": "text-blue-400 bg-blue-400/10"
              };
              
              const productWithStyles = {
                ...product,
                statusColor: product.statusColor || statusColorMap[product.status] || "text-white/40 bg-white/5"
              };

              return <ProductCard key={product.id} product={productWithStyles} />;
            })}
          </div>
        </div>
      </Section>

      <NowBuilding />
      <InnovationMetrics />

      {/* Product-Grade CTA */}
      <Section className="py-40 text-center border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-12">Ready to Build <br />the Future?</h2>
          <p className="text-2xl text-white/40 font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
            We partner with visionary organizations to architect and deploy high-signal digital products.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <MagneticButton>
              <a href="/#contact" className="px-14 py-6 bg-white text-black rounded-[32px] font-bold text-xl shadow-2xl hover:scale-[1.02] transition-transform">
                Request Partnership
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="/#contact" className="px-14 py-6 glass-card border-white/20 rounded-[32px] font-bold text-xl hover:bg-white/10 transition-colors">
                Collaborate
              </a>
            </MagneticButton>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ProjectsPage;
