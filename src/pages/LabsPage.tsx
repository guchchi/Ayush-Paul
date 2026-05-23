import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Search, Layers, Cpu, Code, Eye, Terminal, Activity } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';
import { LabCard } from '../components/ui/LabCard';
import { getPublishedProducts } from '../lib/product-utils';
import { Product } from '../types';

const CATEGORIES = [
  { id: 'all', label: 'Ecosystem Nodes', icon: Layers, nodeNum: '00' },
  { id: 'robotics', label: 'Cybernetics & Robotics', icon: Cpu, nodeNum: '01' },
  { id: 'source-code', label: 'Neural Intelligence', icon: Code, nodeNum: '02' },
  { id: 'blueprints', label: 'Spatial Interfaces', icon: Eye, nodeNum: '03' },
];

export const LabsPage = () => {
  useSEO({
    title: "Innovation Lab | Systems Research & Venture Blueprints by Ayush Paul",
    description: "Explore operational R&D system nodes, mechanical CAD blueprints, and cybernetic prototypes engineered by Ayush Paul.",
    keywords: "Ayush Paul Labs, Cybernetics, Robotics, Neural Networks, Advanced Interfaces, Spatial Blueprints",
    url: getCanonicalUrl("/labs")
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getPublishedProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category.toLowerCase() === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#0A0A0A] pt-32 pb-24 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Visual Engineering Grid Pattern background */}
      <div className="absolute top-0 right-0 w-full h-full grid-pattern opacity-[0.03] pointer-events-none -z-10" />
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-primary/5 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-8 font-mono"
          >
            <Activity size={12} className="animate-pulse" /> R&D SYSTEMS MAINFRAME V3.12
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter mb-6"
          >
            Experimental <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Systems & Blueprints.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg md:text-xl max-w-2xl font-medium leading-relaxed"
          >
            Deploy autonomous software systems, explore physical CAD schematics, and study active neural prototypes engineered at the frontier of cybernetics.
          </motion.p>
        </div>

        {/* Cinematic Mainframe Status Telemetry Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full glass border border-white/5 rounded-3xl p-6 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 font-mono text-[10px] tracking-wider text-white/50 bg-black/40 relative z-10"
        >
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-white font-bold">SYSTEMS INTEGRITY:</span> OPTIMAL
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <div>
              <span className="text-brand-primary">SECURE SHELL:</span> SH-256 // CRYPTO_OK
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <div>
              <span className="text-brand-accent">CORE RATENCY:</span> 84MS
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <div className="flex items-center gap-1.5">
              <Terminal size={12} className="text-brand-primary" />
              <span>ACTIVE RESEARCH PIPELINES: 4</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/20">GRID:</span>
            <span className="text-brand-primary font-bold">LATITUDE_NODE_VREF_3.0</span>
          </div>
        </motion.div>

        {/* Tools & Filters */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-16 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all font-mono border ${
                    activeCategory === cat.id 
                      ? 'bg-brand-primary text-black border-brand-primary shadow-[0_0_20px_rgba(0,194,255,0.25)] scale-[1.01]' 
                      : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <span className={`text-[9px] mr-0.5 ${activeCategory === cat.id ? 'text-black/50' : 'text-brand-primary/50'}`}>
                    N.{cat.nodeNum}
                  </span>
                  <Icon size={12} /> {cat.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-auto font-mono">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            <input 
              type="text" 
              placeholder="Query R&D Registry..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-6 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-xs text-white focus:outline-none focus:border-brand-primary/30 transition-colors placeholder:text-white/20 font-medium"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 font-mono">
            <div className="w-10 h-10 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Establishing Node Link...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
              >
                <LabCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-white/5 rounded-[3rem] glass relative z-10">
            <Package size={40} className="text-white/10 mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">No nodes matched</h3>
            <p className="text-white/40 text-sm max-w-sm">The queried query sequence does not match any current R&D assets.</p>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default LabsPage;
