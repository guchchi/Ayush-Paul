import React, { useState, useEffect } from 'react';
import { getKnowledgeGraph } from '../../lib/knowledge-graph/instance';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ChevronLeft, ChevronRight, RotateCw,
  ArrowUpRight, Bot, Globe, Search as SearchIcon, Zap, Layers, CheckCircle2, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface BlueprintsGridProps {
  products: Product[];
  loading: boolean;
  error: boolean;
  activeCategory: string;
  onCategorySelect?: (cat: string) => void;
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
  const catStyle = getCategoryStyle(product.category);
  const isComingSoon = product.status === 'COMING_SOON';

  // Read actual schema fields to avoid hardcoded mock data
  const outcomes = product.outcomes && product.outcomes.length > 0 ? product.outcomes[0] : null;
  const bestFor = product.idealFor && product.idealFor.length > 0 ? product.idealFor[0] : null;
  const timeSaved = product.estimatedImplementationTime || null;
  const difficulty = product.difficultyLevel || null;

  const hasMetadata = outcomes || bestFor || timeSaved || difficulty;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.25) }}
      className="h-full"
    >
      <Link
        to={`/blueprints/${product.slug}`}
        className="group flex flex-col bg-white border border-[#c2c6d6]/30 rounded-2xl overflow-hidden shadow-sm
                   hover:shadow-md hover:border-[#0b1c30]/20 transition-all duration-200 h-full text-left relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]"
      >
        {/* Coming Soon Overlay */}
        {isComingSoon && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-[#0b1c30]/90 flex items-center justify-center mb-2.5 shadow-md">
              <Lock size={15} className="text-[#d1f34d]" />
            </div>
            <span className="text-xs font-bold text-[#0b1c30] tracking-tight">Unlock Soon</span>
            <span className="text-[9px] text-[#424754]/70 font-semibold mt-0.5">Coming Soon</span>
          </div>
        )}

        <div className="h-1 w-full" style={{ backgroundColor: catStyle.color }} />

        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span
              className="inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-[0.16em] shadow-sm border bg-white"
              style={{ color: catStyle.color, borderColor: catStyle.border }}
            >
              {product.category}
            </span>
            {isComingSoon && (
              <span className="px-2 py-0.5 rounded-full bg-[#fff8e1] border border-[#ffe082] text-[#f57f17] text-[8px] font-bold uppercase tracking-wider">
                Coming Soon
              </span>
            )}
            {product.freeFileUrl && (
              <span className="px-2 py-0.5 rounded-full bg-[#f0fbe8] border border-[#bbf7d0] text-[#558b2f] text-[8px] font-bold uppercase tracking-wider">
                Free Resource
              </span>
            )}
            {product.paidFileUrl && (
              <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] border border-[#dce9ff] text-[#0058be] text-[8px] font-bold uppercase tracking-wider">
                Premium
              </span>
            )}
          </div>

          <h3 className="text-base font-extrabold text-[#0b1c30] tracking-tight leading-snug mb-2
                         group-hover:text-[#0058be] transition-colors duration-200 line-clamp-2">
            {product.title}
          </h3>

          <p className="text-xs text-[#424754] leading-relaxed font-semibold flex-1 mb-5 line-clamp-3">
            {product.description}
          </p>

          {/* Spacing preserved - only displays if real schema metadata is populated */}
          {hasMetadata && (
            <div className="grid grid-cols-1 gap-2 mb-5 bg-gray-50/50 p-4 rounded-xl border border-gray-100/50 text-[11px] font-medium leading-tight">
              {bestFor && (
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[#424754]/55 text-[9px] font-bold uppercase tracking-wider">Best For:</span>
                  <span className="font-bold text-[#0b1c30] text-right">{bestFor}</span>
                </div>
              )}
              {outcomes && (
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[#424754]/55 text-[9px] font-bold uppercase tracking-wider">Outcome:</span>
                  <span className="font-bold text-[#0b1c30] text-right">{outcomes}</span>
                </div>
              )}
              {timeSaved && (
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[#424754]/55 text-[9px] font-bold uppercase tracking-wider">Est. Time:</span>
                  <span className="font-bold text-[#558b2f] text-right">{timeSaved}</span>
                </div>
              )}
              {difficulty && (
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[#424754]/55 text-[9px] font-bold uppercase tracking-wider">Difficulty:</span>
                  <span className="font-bold text-[#0b1c30] text-right">{difficulty}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[#c2c6d6]/20 mt-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60
                             group-hover:text-[#0b1c30] transition-colors duration-200">
              {isComingSoon ? 'Preview' : 'Open Blueprint'}
            </span>
            <span
              className="w-7 h-7 rounded-full bg-bg-secondary border border-[#c2c6d6]/20 flex items-center justify-center
                         group-hover:bg-[#0b1c30] group-hover:border-[#0b1c30] transition-all duration-200 shrink-0"
            >
              <ArrowUpRight
                size={13}
                className="text-[#0b1c30] group-hover:text-white transition-colors duration-200"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const BlueprintCardSkeleton = () => (
  <div className="bg-white border border-[#c2c6d6]/30 rounded-2xl overflow-hidden flex flex-col animate-pulse shadow-sm text-left">
    <div className="h-1 bg-gray-100" />
    <div className="p-6 flex-1 flex flex-col">
      <div className="h-4 bg-gray-100 rounded-full w-20 mb-4" />
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-full mb-1.5" />
      <div className="h-4 bg-gray-100 rounded w-5/6 mb-4" />
      <div className="h-16 bg-gray-50 rounded-xl mb-4" />
      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="h-3 bg-gray-100 rounded w-24" />
        <div className="w-7 h-7 rounded-full bg-gray-100" />
      </div>
    </div>
  </div>
);

const ITEMS_PER_PAGE = 9;

export const BlueprintsGrid = ({
  products, loading, error, activeCategory, onCategorySelect, onRetry, trackEvent,
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
      }, 850);
      return () => clearTimeout(t);
    }
  }, [searchQuery]);

  const filteredProducts = products.filter(p => {
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

    if (!searchQuery.trim()) return matchCat;

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
    if (onCategorySelect) {
      onCategorySelect(id);
    }
  };

  const getResultContext = () => {
    const count = sorted.length;
    const catLabel = FILTERS.find(f => f.id === localCategory)?.label || 'Blueprints';
    if (count === 0) {
      return 'No blueprints found';
    }
    if (localCategory === 'all') {
      return `${count} blueprint${count !== 1 ? 's' : ''} available`;
    }
    return `${count} blueprint${count !== 1 ? 's' : ''} in ${catLabel}`;
  };

  if (error) {
    return (
      <section className="py-16 px-6 max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-5">
        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
          <RotateCw size={20} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-[#0b1c30]">Unable to load blueprints</h3>
        <p className="text-xs text-[#424754]/80 max-w-sm leading-relaxed font-semibold">
          The library registry couldn't sync. Check your connection and try again.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-[#0b1c30] text-white hover:bg-[#152e4b]
                     px-6 h-11 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]"
        >
          <RotateCw size={12} /> Retry
        </button>
      </section>
    );
  }

  return (
    <section
      className="py-16 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-24 border-t border-[#c2c6d6]/20"
      id="blueprints-grid-anchor"
    >
      {/* Section header to establish hierarchy */}
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-4">
          <span className="w-1.5 h-1.5 bg-[#0b1c30] rounded-full" />
          <span className="tracking-[0.22em]">Blueprints Library</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.1] text-[#0b1c30]">
            Browse all blueprints
          </h2>

          <p className="text-[#424754] text-sm leading-relaxed font-medium">
            Explore our curated implementation library of prompts, templates, checklists, and automated workflows designed to accelerate your development.
          </p>
        </div>
      </div>

      {/* Discovery Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-8">
        <div className="relative w-full lg:w-80">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424754]/40 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search blueprints..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search blueprints"
            className="w-full pl-10 pr-10 py-3.5 bg-white border border-[#c2c6d6]/35 rounded-xl
                       text-sm text-[#0b1c30] placeholder:text-[#424754]/40
                       focus:outline-none focus:border-[#0b1c30] focus:ring-2 focus:ring-[#0b1c30]/10
                       transition-all duration-200 font-semibold shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[#424754]/40 hover:text-[#0b1c30] hover:bg-gray-100 transition-all cursor-pointer border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0b1c30]"
            >
              <span className="text-sm font-bold">×</span>
            </button>
          )}
        </div>

        {/* Categories scrollable pill row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 lg:pb-0 lg:mb-0 scrollbar-none flex-wrap lg:flex-nowrap">
          {FILTERS.map(f => {
            const Icon = f.icon;
            const isActive = localCategory === f.id;
            return (
              <button
                key={f.id}
                onClick={() => handleLocalCategory(f.id)}
                className={`flex items-center gap-1.5 px-4 h-10 rounded-full text-[10px] font-bold uppercase
                            tracking-wider transition-all duration-200 border cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]
                            ${isActive
                              ? 'bg-[#0b1c30] text-white border-[#0b1c30] shadow-sm font-extrabold'
                              : 'bg-white border-[#c2c6d6]/30 text-[#424754]/85 hover:text-[#0b1c30] hover:border-[#0b1c30]/20 hover:bg-[#eff4ff]'
                            }`}
              >
                <Icon size={11} className="shrink-0" />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Results Context Label */}
      {!loading && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/50">
            {getResultContext()}
          </p>
        </div>
      )}

      {/* Grid Content */}
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
          <div key="empty" className="w-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-150 flex items-center justify-center mb-4">
              <Search className="text-[#424754]/50" size={20} />
            </div>
            <h3 className="text-base font-extrabold text-[#0b1c30] mb-1">No blueprints found</h3>
            <p className="text-xs text-[#424754]/75 mb-6 max-w-xs font-semibold">
              Try another search or clear your current filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleLocalCategory('all');
              }}
              className="px-5 h-10 bg-[#0b1c30] text-white rounded-full font-bold text-[10px] uppercase tracking-wider hover:bg-[#152e4b] active:scale-[0.98] transition-all cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]"
            >
              Clear filters & search
            </button>
          </div>
        )}
      </AnimatePresence>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="w-10 h-10 rounded-xl border border-[#c2c6d6]/35 bg-white flex items-center justify-center
                       text-[#424754]/60 hover:text-[#0b1c30] hover:border-[#0b1c30]/20 hover:bg-bg-secondary
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              aria-label={`Page ${page}`}
              className={`w-10 h-10 rounded-xl text-xs font-bold uppercase tracking-wider
                          transition-all duration-200 border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]
                          ${currentPage === page
                            ? 'bg-[#0b1c30] text-white border-[#0b1c30] shadow-sm font-extrabold'
                            : 'bg-white border-[#c2c6d6]/35 text-[#424754]/75 hover:text-[#0b1c30] hover:bg-[#eff4ff] hover:border-[#0b1c30]/20'
                          }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="w-10 h-10 rounded-xl border border-[#c2c6d6]/35 bg-white flex items-center justify-center
                       text-[#424754]/60 hover:text-[#0b1c30] hover:border-[#0b1c30]/20 hover:bg-bg-secondary
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Subtle Ecosystem Connections */}
      {!loading && (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 bg-gray-50/50 border border-[#c2c6d6]/25 rounded-2xl flex flex-col justify-between items-start gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0b1c30]">Need Step-by-Step Guidance?</h4>
              <p className="text-[11px] text-[#424754] font-semibold mt-2 leading-relaxed">
                Learn the architectural thinking, prompt engineering principles, and system configurations that sit behind every blueprint.
              </p>
            </div>
            <Link to="/mastery" className="text-[10px] font-bold uppercase tracking-wider text-[#0b1c30] hover:text-white hover:bg-[#0b1c30] px-4 py-2 rounded-full border border-[#c2c6d6]/40 transition-colors bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]">
              Start Learning →
            </Link>
          </div>

          <div className="p-6 bg-gray-50/50 border border-[#c2c6d6]/25 rounded-2xl flex flex-col justify-between items-start gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b35ff]">Want Implementation Guides?</h4>
              <p className="text-[11px] text-[#424754] font-semibold mt-2 leading-relaxed">
                Read how these blueprints are built — articles on AI tools, automation systems, and technical workflows.
              </p>
            </div>
            <Link to="/blog" className="text-[10px] font-bold uppercase tracking-wider text-[#0b1c30] hover:text-white hover:bg-[#0b1c30] px-4 py-2 rounded-full border border-[#c2c6d6]/40 transition-colors bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]">
              Read the Blog →
            </Link>
          </div>

          <div className="p-6 bg-gray-50/50 border border-[#c2c6d6]/25 rounded-2xl flex flex-col justify-between items-start gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#558b2f]">Need Direct Implementation Help?</h4>
              <p className="text-[11px] text-[#424754] font-semibold mt-2 leading-relaxed">
                If a blueprint needs custom configuration, API integration, or full deployment — work with Ayush directly.
              </p>
            </div>
            <Link to="/collaborate" className="text-[10px] font-bold uppercase tracking-wider text-[#0b1c30] hover:text-white hover:bg-[#0b1c30] px-4 py-2 rounded-full border border-[#c2c6d6]/40 transition-colors bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]">
              Work Directly With Ayush →
            </Link>
          </div>
        </div>
      )}

      {!loading && paginated.length > 0 && (
        <p className="text-center text-[9px] font-bold uppercase tracking-[0.25em] text-[#424754]/30 mt-12 select-none">
          Build it. Launch it. Scale it.
        </p>
      )}
    </section>
  );
};
