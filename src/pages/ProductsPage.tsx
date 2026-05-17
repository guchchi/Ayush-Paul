import React from 'react';
import { motion } from 'motion/react';
import { Layers, Terminal, Sparkles } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';
import { EcosystemCard, EcosystemProduct } from '../components/ui/EcosystemCard';

const ECOSYSTEM_PRODUCTS: EcosystemProduct[] = [
  {
    id: "ai-life-navigator",
    title: "AI Life Navigator",
    slug: "ai-life-navigator",
    category: "AI & Productivity",
    description: "An agentic productivity nervous system standardizing the bridge between human life goals and daily task execution. Built with intelligent planning systems.",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200",
    appUrl: "https://ai-life-navigator.vercel.app",
    githubUrl: "https://github.com/guchchi/ai-life-navigator",
    status: "Production",
    tech: ["React", "TypeScript", "Google Gemini API", "Tailwind CSS", "Express"]
  }
];

export const ProductsPage = () => {
  useSEO({
    title: "Digital Products Ecosystem | Ayush Paul",
    description: "Discover production-grade SaaS platforms, AI-ready agents, and software tools engineered by Ayush Paul.",
    keywords: "Ayush Paul Products, SaaS Ecosystem, AI Life Navigator, Software Products",
    url: getCanonicalUrl("/products")
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#0A0A0A] pt-32 pb-24 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Layers size={14} /> Production Nodes
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter mb-6"
          >
            Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Ecosystem.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg md:text-xl max-w-2xl font-medium"
          >
            Discover standalone production-grade SaaS systems, AI-powered developer utilities, and web services built and managed by Ayush Paul.
          </motion.p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ECOSYSTEM_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EcosystemCard project={product} />
            </motion.div>
          ))}
          
          {/* Future Scaling Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border-2 border-dashed border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group hover:border-brand-primary/10 transition-colors py-20"
          >
            <Terminal size={32} className="text-white/10 mb-6 group-hover:text-brand-primary/40 transition-colors" />
            <h3 className="text-lg font-bold text-white/50 mb-2">Next Node Compiling</h3>
            <p className="text-xs text-white/20 max-w-[200px] leading-relaxed">
              New autonomous apps and services are built continuously. Stay updated.
            </p>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default ProductsPage;
