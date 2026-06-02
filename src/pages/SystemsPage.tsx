import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Search, Cpu, Code, Settings, Package, ShieldCheck, Globe } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';
import { EcosystemCard } from '../components/ui/EcosystemCard';
import { getPublishedProducts } from '../lib/product-utils';
import { Product } from '../types';

const CATEGORIES = [
  { id: 'all', label: 'All Blueprints', icon: Layers, refCode: 'ALL_BLUEPRINTS' },
  { id: 'ai', label: 'AI Workflows', icon: Cpu, refCode: 'AI_WORKFLOWS' },
  { id: 'web', label: 'Website Systems', icon: Code, refCode: 'WEBSITE_SYSTEMS' },
  { id: 'seo', label: 'SEO Systems', icon: Globe, refCode: 'SEO_SYSTEMS' },
  { id: 'automation', label: 'Automation Playbooks', icon: Settings, refCode: 'AUTOMATION' },
];

export const SystemsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Verified acquisition ticker state
  const [tickerNotification, setTickerNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getPublishedProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Simulate verified acquisition live updates
  useEffect(() => {
    const notifications = [
      "User unlocked AI Website Launch Blueprint",
      "Developer downloaded SEO Foundation Checklist",
      "Automation Starter Pack Scenario JSON configured",
      "Stripe payment synchronized: SaaS Boilerplate unlocked"
    ];
    
    const interval = setInterval(() => {
      const randomMsg = notifications[Math.floor(Math.random() * notifications.length)];
      setTickerNotification(randomMsg);
      setTimeout(() => setTickerNotification(null), 4000);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  useSEO({
    title: "Blueprints & Templates | Ayush Paul",
    description: "Get access to ready-to-run Next.js templates, AI rules configs, SEO checklists, and Make.com automation playbooks.",
    keywords: "Ayush Paul, Blueprints, Next.js Templates, Cursor AI Rules, SEO Checklist, Make.com Playbooks, Automation",
    url: getCanonicalUrl("/systems"),
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Blueprints & Templates Registry by Ayush Paul",
      "description": "A registry of templates, checklists, and automation playbooks built by Ayush Paul.",
      "url": getCanonicalUrl("/systems"),
      "provider": {
        "@type": "Person",
        "name": "Ayush Paul",
        "url": getCanonicalUrl()
      }
    }
  });

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || (product.category ?? '').toLowerCase() === activeCategory;
    const matchesSearch = (product.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#0A0A0A] pt-32 pb-24 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-primary/[0.02] blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-white/80 text-[11px] font-semibold tracking-wide mb-8"
          >
            <ShieldCheck size={14} className="text-brand-primary" /> Active Blueprints Registry
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Blueprints &amp; <span className="text-white/60">Templates.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl font-medium leading-relaxed"
          >
            Explore Next.js templates, download Cursor AI configs, and study automation playbooks designed by Ayush Paul.
          </motion.p>
        </div>

        {/* Dynamic Filters & Search Panel */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-16 relative z-10">
          
          {/* Categories Filter list */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wide transition-all border ${
                    activeCategory === cat.id 
                      ? 'bg-brand-primary text-black border-brand-primary shadow-[0_0_25px_rgba(0,194,255,0.15)] scale-[1.01]' 
                      : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:bg-white/[0.04] hover:border-white/10'
                  }`}
                >
                  <Icon size={13} /> {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={14} />
            <input 
              type="text" 
              placeholder="Search active blueprints..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-6 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-xs text-white focus:outline-none focus:border-white/15 transition-colors placeholder:text-white/20 font-medium"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-[10px] font-semibold tracking-wider text-white/20">Synchronizing registry...</span>
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
                <EcosystemCard project={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-white/5 rounded-[2.5rem] bg-white/[0.01] relative z-10">
            <Package size={40} className="text-white/10 mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">No blueprints matched</h3>
            <p className="text-white/40 text-sm max-w-sm">The queried parameters did not match any currently active blueprints.</p>
          </div>
        )}

      </div>

      {/* Verified Acquisition Live Notification Ticker */}
      <AnimatePresence>
        {tickerNotification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-[100] max-w-sm p-4 bg-[#0F0F11]/90 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mr-1 shrink-0">Blueprint Unlock</span>
            <p className="text-xs text-white/80 leading-normal font-semibold font-display line-clamp-1">{tickerNotification}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SystemsPage;
