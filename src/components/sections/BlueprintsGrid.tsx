import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ChevronLeft, ChevronRight, RotateCw,
  Clock, Award, BarChart2, ArrowUpRight, Bot, Globe, Search as SearchIcon, Zap, Layers, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SystemEmptyState } from '../ui/SystemEmptyState';
import { Product } from '../../types';

interface BlueprintsGridProps {
  products: Product[];
  loading: boolean;
  error: boolean;
  activeCategory: string;
  onRetry: () => void;
  trackEvent: (eventName: string, payload?: Record<string, any>) => void;
}

const FILTERS = [
  { id: 'all',        label: 'All',        icon: Layers      },
  { id: 'prompts',    label: 'Prompts',    icon: Bot         },
  { id: 'templates',  label: 'Templates',  icon: Globe       },
  { id: 'workflows',  label: 'Workflows',  icon: SearchIcon  },
  { id: 'automations',label: 'Automations',icon: Zap         },
  { id: 'blueprints', label: 'Blueprints', icon: Layers      },
  { id: 'checklists', label: 'Checklists', icon: CheckCircle2 }
];

// Structured GEO metadata — helps AI systems extract "what it is, who it's for, what outcome, time saved"
const getOutcomeDetails = (product: Product) => {
  const title = (product.title ?? '').toLowerCase();
  const cat = (product.category ?? '').toLowerCase();

  if (cat === 'prompts' || title.includes('cursor') || title.includes('prompt')) {
    return {
      bestFor: 'Developers using Cursor AI or LLMs',
      outcome: 'Pre-configured AI prompt pack — deploy immediately',
      timeSaved: '10+ Hours / Week'
    };
  }
  if (title.includes('research') || title.includes('content')) {
    return {
      bestFor: 'Content creators & researchers',
      outcome: 'AI-powered research and content workflow',
      timeSaved: '6+ Hours / Article'
    };
  }
  if (title.includes('saas') || title.includes('launch') || cat === 'templates') {
    return {
      bestFor: 'SaaS founders & full-stack engineers',
      outcome: 'Production-ready Next.js boilerplate with auth & payments',
      timeSaved: '40+ Hours Saved'
    };
  }
  if (title.includes('brand') || title.includes('portfolio') || title.includes('personal')) {
    return {
      bestFor: 'Creators, developers & freelancers',
      outcome: 'High-performance personal website template',
      timeSaved: '20+ Hours Saved'
    };
  }
  if (title.includes('seo') || title.includes('authority') || cat === 'workflows') {
    return {
      bestFor: 'Founders, marketers & SEO managers',
      outcome: 'Full technical SEO audit workflow & checklist',
      timeSaved: '6–8 Hours / Audit'
    };
  }
  if (title.includes('automation') || title.includes('make') || cat === 'automations') {
    return {
      bestFor: 'Operators, founders & no-code builders',
      outcome: 'Zero-maintenance Make.com automation scenarios',
      timeSaved: '8+ Hours / Month'
    };
  }
  if (cat === 'checklists') {
    return {
      bestFor: 'Teams running repeatable technical processes',
      outcome: 'Structured verification checklist — deploy & track',
      timeSaved: '3–5 Hours / Cycle'
    };
  }
  return {
    bestFor: 'Developers & technical founders',
    outcome: 'Ready-to-use implementation framework',
    timeSaved: '5+ Hours Saved'
  };
};


const getCategoryStyle = (category: string) => {
  const c = (category ?? '').toLowerCase();
  if (c.includes('ai') || c === 'prompts') 
    return { bg: '#f3efff', color: '#6b35ff', border: '#ebe5ff' };
  if (c.includes('web') || c === 'templates' || c === 'blueprints') 
    return { bg: '#f0f0f0', color: '#0b1c30', border: '#e0e0e0' };
  if (c.includes('seo') || c === 'workflows') 
    return { bg: '#fff4eb', color: '#ff8000', border: '#ffe9d6' };
  if (c.includes('auto') || c === 'automations') 
    return { bg: '#f0fbe8', color: '#558b2f', border: '#e1f7d2' };
  return { bg: '#eff4ff', color: '#0b1c30', border: '#e2e2e2' };
};

const BlueprintLibraryCard = ({ product, index }: { product: Product; index: number }) => {
  const outcomes = getOutcomeDetails(product);
  const catStyle = getCategoryStyle(product.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.045, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/blueprints/${product.slug}`}
        className="group flex flex-col bg-white border border-[#c2c6d6]/30 rounded-[32px] overflow-hidden shadow-sm
                   hover:shadow-ambient hover:scale-[1.01] hover:border-[#1a1a1a]/20 transition-all duration-300 h-full text-left"
      >
        <div className="h-1 w-full" style={{ backgroundColor: catStyle.color }} />

        <div className="flex flex-col flex-1 p-7">
          <span
            className="inline-flex w-fit items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.18em] mb-5 shadow-sm border"
            style={{ backgroundColor: catStyle.bg, color: catStyle.color, borderColor: catStyle.border }}
          >
            {product.category}
          </span>

          <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight leading-snug mb-3
                         group-hover:text-[#0b1c30] transition-colors duration-300 line-clamp-2">
            {product.title}
          </h3>

          <p className="text-xs text-[#424754] leading-relaxed font-semibold flex-1 mb-6 line-clamp-3">
            {product.description}
          </p>

          {/* Outcome-focused Metadata Grid */}
          <div className="grid grid-cols-1 gap-2.5 mb-7 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 text-xs">
            <div className="flex justify-between items-start">
              <span className="font-bold text-[#424754]/50 text-[9px] uppercase tracking-wider">Best For:</span>
              <span className="font-extrabold text-[#0b1c30] text-right">{outcomes.bestFor}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-bold text-[#424754]/50 text-[9px] uppercase tracking-wider">Outcome:</span>
              <span className="font-extrabold text-[#0b1c30] text-right">{outcomes.outcome}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-bold text-[#424754]/50 text-[9px] uppercase tracking-wider">Time Saved:</span>
              <span className="font-extrabold text-[#558b2f] text-right">{outcomes.timeSaved}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-[#c2c6d6]/20">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60
                             group-hover:text-[#0b1c30] transition-colors duration-300">
              Explore Blueprint
            </span>
            <span
              className="w-8 h-8 rounded-full bg-bg-secondary border border-[#c2c6d6]/20 flex items-center justify-center
                         group-hover:bg-[#0b1c30] group-hover:border-[#0b1c30] transition-all duration-300 shrink-0"
            >
              <ArrowUpRight
                size={14}
                className="text-[#0b1c30] group-hover:text-white transition-colors duration-300"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const BlueprintCardSkeleton = () => (
  <div className="bg-white border border-[#c2c6d6]/30 rounded-[32px] overflow-hidden flex flex-col animate-pulse shadow-sm text-left">
    <div className="h-1 bg-gray-100" />
    <div className="p-7 flex-1 flex flex-col">
      <div className="h-5 bg-gray-100 rounded-full w-20 mb-5" />
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-full mb-1.5" />
      <div className="h-4 bg-gray-100 rounded w-5/6 mb-6" />
      <div className="h-20 bg-gray-50 rounded-2xl mb-7" />
      <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
        <div className="h-3 bg-gray-100 rounded w-24" />
        <div className="w-8 h-8 rounded-full bg-gray-100" />
      </div>
    </div>
  </div>
);

const ITEMS_PER_PAGE = 9;

export const BlueprintsGrid = ({
  products, loading, error, activeCategory, onRetry, trackEvent,
}: BlueprintsGridProps) => {
  const [searchQuery, setSearchQuery]   = useState('');
  const [localCategory, setLocalCategory] = useState(activeCategory);
  const [currentPage, setCurrentPage]  = useState(1);

  useEffect(() => { setLocalCategory(activeCategory); }, [activeCategory]);
  useEffect(() => { setCurrentPage(1); }, [localCategory, searchQuery]);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const t = setTimeout(() => {
        trackEvent('Search Used', { query: searchQuery, section: 'BlueprintsLibrary' });
      }, 800);
      return () => clearTimeout(t);
    }
  }, [searchQuery]);

  const filteredProducts = products.filter(p => {
    // Map database categories to new filter tags
    const pCat = (p.category ?? '').toLowerCase();
    const active = localCategory.toLowerCase();
    
    let matchCat = active === 'all';
    if (!matchCat) {
      if (active === 'prompts') matchCat = pCat.includes('ai') || pCat.includes('prompt');
      else if (active === 'templates') matchCat = pCat.includes('web') || pCat.includes('template');
      else if (active === 'workflows') matchCat = pCat.includes('seo') || pCat.includes('workflow');
      else if (active === 'automations') matchCat = pCat.includes('auto') || pCat.includes('automation');
      else if (active === 'blueprints') matchCat = pCat.includes('saas') || pCat.includes('blueprint') || pCat.includes('website');
      else if (active === 'checklists') matchCat = pCat.includes('audit') || pCat.includes('checklist');
      else matchCat = pCat === active;
    }

    const q = searchQuery.toLowerCase();
    const matchSearch =
      (p.title ?? '').toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q) ||
      (p.tags ?? []).some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const sorted = [...filteredProducts].sort((a, b) => {
    const dA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
    const dB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
    return dB - dA;
  });

  const totalPages      = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated       = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const anchor = document.getElementById('blueprints-grid-anchor');
    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLocalCategory = (id: string) => {
    setLocalCategory(id);
    trackEvent('Library Filter Changed', { category: id });
  };

  if (error) {
    return (
      <section className="py-20 px-6 max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
          <RotateCw size={22} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-[#0b1c30]">Unable to load blueprints</h3>
        <p className="text-sm text-[#424754]/80 max-w-sm leading-relaxed">
          The library registry couldn't sync. Check your connection and try again.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-[#0b1c30] text-white hover:bg-black
                     px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm border-none"
        >
          <RotateCw size={13} /> Retry
        </button>
      </section>
    );
  }

  return (
    <section
      className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-24 border-t border-[#c2c6d6]/20"
      id="blueprints-grid-anchor"
    >
      <div className="mb-14 text-left">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
        >
          <span className="w-1.5 h-1.5 bg-[#0b1c30] rounded-full" />
          <span className="tracking-[0.22em]">Library</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1]"
          >
            Browse All<br />Blueprints
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#424754] text-base leading-relaxed font-medium"
          >
            Explore our curated implementation library of prompts, templates, checklists, and automated workflows designed to accelerate your development.
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10"
      >
        <div className="relative w-full sm:w-80">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424754]/40 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search blueprints, templates..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#c2c6d6]/35 rounded-xl
                       text-sm text-[#0b1c30] placeholder:text-[#424754]/40
                       focus:outline-none focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/10
                       transition-all duration-300 font-semibold shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map(f => {
            const Icon = f.icon;
            const isActive = localCategory === f.id;
            return (
              <button
                key={f.id}
                onClick={() => handleLocalCategory(f.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[10px] font-bold uppercase
                            tracking-widest transition-all duration-300 border cursor-pointer
                            ${isActive
                              ? 'bg-[#0b1c30] text-white border-[#0b1c30] shadow-sm'
                              : 'bg-white border-[#c2c6d6]/30 text-[#424754]/80 hover:text-[#0b1c30] hover:border-[#0058be]/20 hover:bg-[#eff4ff]'
                            }`}
              >
                <Icon size={11} />
                {f.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {!loading && (
        <div className="flex items-center justify-between mb-7">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/50">
            {filteredProducts.length === 0
              ? 'No blueprints found'
              : `${filteredProducts.length} blueprint${filteredProducts.length !== 1 ? 's' : ''} available`}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/50 hover:text-[#0b1c30] transition-colors cursor-pointer border-none bg-transparent"
            >
              Clear search ×
            </button>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <div key="skeletons" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <BlueprintCardSkeleton key={i} />)}
          </div>
        ) : paginated.length > 0 ? (
          <div key="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((prod, i) => (
              <BlueprintLibraryCard key={prod.id} product={prod} index={i} />
            ))}
          </div>
        ) : (
          <div key="empty" className="w-full flex items-center justify-center py-24">
            <SystemEmptyState title="No Blueprints Found" />
          </div>
        )}
      </AnimatePresence>

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2.5 mt-14">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl border border-[#c2c6d6]/35 bg-white flex items-center justify-center
                       text-[#424754]/60 hover:text-[#0b1c30] hover:border-[#0058be]/20 hover:bg-bg-secondary
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-xl text-xs font-bold uppercase tracking-wider
                          transition-all duration-300 border cursor-pointer
                          ${currentPage === page
                            ? 'bg-[#0b1c30] text-white border-[#0b1c30] shadow-sm'
                            : 'bg-white border-[#c2c6d6]/35 text-[#424754]/75 hover:text-[#0b1c30] hover:bg-[#eff4ff] hover:border-[#0058be]/20'
                          }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl border border-[#c2c6d6]/35 bg-white flex items-center justify-center
                       text-[#424754]/60 hover:text-[#0b1c30] hover:border-[#0058be]/20 hover:bg-bg-secondary
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Subtle Ecosystem Connections */}
      {!loading && (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-8 bg-gray-50/50 border border-[#c2c6d6]/25 rounded-[24px] flex flex-col justify-between items-start gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b1c30]">Need Step-by-Step Guidance?</h4>
              <p className="text-[11px] text-[#424754] font-semibold mt-2 leading-relaxed">
                Learn the architectural thinking, prompt engineering principles, and system configurations that sit behind every blueprint.
              </p>
            </div>
            <Link to="/academy" className="text-xs font-bold text-[#0b1c30] hover:text-[#d1f34d] hover:bg-[#0b1c30] px-5 py-2.5 rounded-full border border-[#c2c6d6]/40 transition-colors bg-white">
              Learn in the Academy →
            </Link>
          </div>

          <div className="p-8 bg-gray-50/50 border border-[#c2c6d6]/25 rounded-[24px] flex flex-col justify-between items-start gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b35ff]">Want Implementation Guides?</h4>
              <p className="text-[11px] text-[#424754] font-semibold mt-2 leading-relaxed">
                Read how these blueprints are built — articles on AI tools, automation systems, and technical workflows.
              </p>
            </div>
            <Link to="/blog" className="text-xs font-bold text-[#0b1c30] hover:text-[#d1f34d] hover:bg-[#0b1c30] px-5 py-2.5 rounded-full border border-[#c2c6d6]/40 transition-colors bg-white">
              Read the Blog →
            </Link>
          </div>

          <div className="p-8 bg-gray-50/50 border border-[#c2c6d6]/25 rounded-[24px] flex flex-col justify-between items-start gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#558b2f]">Need Direct Implementation Help?</h4>
              <p className="text-[11px] text-[#424754] font-semibold mt-2 leading-relaxed">
                If a blueprint needs custom configuration, API integration, or full deployment — work with Ayush directly.
              </p>
            </div>
            <Link to="/collaborate" className="text-xs font-bold text-[#0b1c30] hover:text-[#d1f34d] hover:bg-[#0b1c30] px-5 py-2.5 rounded-full border border-[#c2c6d6]/40 transition-colors bg-white">
              Work Directly With Ayush →
            </Link>
          </div>
        </div>

      )}

      {!loading && paginated.length > 0 && (
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-[#424754]/30 mt-14 select-none">
          Build it. Launch it. Scale it.
        </p>
      )}
    </section>
  );
};
