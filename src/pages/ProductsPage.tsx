import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Search, Filter, Cpu, Code, BookOpen, Layers } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';
import { ProductCard } from '../components/ui/ProductCard';
import { getPublishedProducts } from '../lib/product-utils';
import { Product } from '../types';

const CATEGORIES = [
  { id: 'all', label: 'All Resources', icon: Layers },
  { id: 'robotics', label: 'Robotics', icon: Cpu },
  { id: 'source-code', label: 'Source Code', icon: Code },
  { id: 'blueprints', label: 'Blueprints', icon: BookOpen },
];

export const ProductsPage = () => {
  useSEO({
    title: "Innovation Lab | Digital Products & Blueprints by Ayush Paul",
    description: "Download premium robotics source code, engineering blueprints, and innovation guides created by Ayush Paul.",
    keywords: "Ayush Paul Lab, Robotics Source Code, Digital Products, Engineering Blueprints",
    canonicalUrl: getCanonicalUrl("/lab")
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
      className="w-full min-h-screen bg-[#0A0A0A] pt-32 pb-24 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Package size={14} /> The Innovation Lab
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter mb-6"
          >
            Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Blueprints.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg md:text-xl max-w-2xl font-medium"
          >
            Download the exact source codes, CAD designs, and engineering systems behind my award-winning projects. Built for creators.
          </motion.p>
        </div>

        {/* Tools & Filters */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-16">
          <div className="flex flex-wrap items-center gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat.id 
                      ? 'bg-brand-primary text-black shadow-[0_0_20px_rgba(0,194,255,0.3)]' 
                      : 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={14} /> {cat.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" 
              placeholder="Search lab..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-colors placeholder:text-white/20 font-medium"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Loading Lab Data...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-white/5 rounded-[3rem] glass">
            <Package size={48} className="text-white/10 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">No blueprints found</h3>
            <p className="text-white/40">Try adjusting your filters or search query.</p>
          </div>
        )}

      </div>
    </motion.div>
  );
};
