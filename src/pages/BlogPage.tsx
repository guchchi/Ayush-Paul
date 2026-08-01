import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, ChevronDown, Check } from "lucide-react";
import { BackButton } from "../components/ui/back-button";
import { cn } from "../lib/utils";
import { formatDate } from "../lib/firebase-utils";
import { SystemEmptyState } from "../components/ui/SystemEmptyState";
import { getKnowledgeGraph } from "../lib/knowledge-graph/instance";

export const BlogPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setActiveDropdown(null);
      setIsFocused(false);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const loadAllPosts = async () => {
      setLoading(true);
      try {
        const kg = getKnowledgeGraph();
        const seoData = await kg.seoService.generateSeoMetadata('eco_blog', 'en');
        if (seoData) {
          document.title = seoData.title;
        }

        const blogVM = await kg.blogProjection.getBlogViewModel('en');
        const mappedPosts = blogVM.posts.map(p => ({
          id: p.nodeId,
          title: p.title,
          slug: p.slug,
          excerpt: p.description,
          date: p.publishedAt,
          readTime: `${p.readingTimeMinutes} min read`,
          tags: p.tags,
          category: p.category,
          content: p.bodyMarkdown || p.description
        }));
        setPosts(mappedPosts);
      } catch (err) {
        console.error("[Blog] Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const s = search.toLowerCase();
    const matchesSearch = 
      post.title.toLowerCase().includes(s) || 
      post.description?.toLowerCase().includes(s) ||
      (post.category || "").toLowerCase().includes(s) ||
      (Array.isArray(post.tags) ? post.tags.some((t: string) => t.toLowerCase().includes(s)) : String(post.tags).toLowerCase().includes(s));
    
    const matchesTag = !selectedTag || (Array.isArray(post.tags) ? post.tags.includes(selectedTag) : String(post.tags).includes(selectedTag));
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    
    return matchesSearch && matchesTag && matchesCategory;
  });

  const allTags = Array.from(new Set(posts.flatMap(p => {
    const rawTags = p.tags || [];
    return (Array.isArray(rawTags) ? rawTags : [rawTags])
      .flatMap(t => typeof t === 'string' ? t.split(',').map(s => s.trim()) : [t])
      .filter(t => t);
  })));

  const allCategories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));

  const CustomSelect = ({ label, value, options, onChange, id }: any) => {
    const isOpen = activeDropdown === id;
    return (
      <div className="relative min-w-[220px]" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => setActiveDropdown(isOpen ? null : id)}
          className={cn(
            "w-full bg-white border border-[#c2c6d6]/35 rounded-[16px] py-4 px-6 flex items-center justify-between transition-colors group cursor-pointer",
            isOpen ? "border-[#0058be] bg-bg-secondary" : "hover:border-[#c2c6d6]/50 hover:bg-[#f8f9ff]"
          )}
        >
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/60">{label}</span>
            <span className="text-xs font-extrabold text-[#0b1c30] whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">
              {value || `All ${label}s`}
            </span>
          </div>
          <ChevronDown size={14} className={cn("text-[#424754]/40 group-hover:text-[#0058be] transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
        
        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[240px] bg-white border border-[#c2c6d6]/30 rounded-2xl overflow-hidden z-[100] shadow-ambient">
            <div className="p-1 max-h-[320px] overflow-y-auto custom-scrollbar">
              <button 
                onClick={() => { onChange(null); setActiveDropdown(null); }}
                className="w-full px-4 py-3 rounded-lg text-left text-[10px] font-bold uppercase tracking-wider hover:bg-[#f8f9ff] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span className={cn(!value ? "text-[#0058be]" : "text-[#424754]/60 group-hover:text-[#424754]")}>All {label}s</span>
                {!value && <Check size={12} className="text-[#0058be]" />}
              </button>
              {options.map((opt: string) => (
                <button 
                  key={opt}
                  onClick={() => { onChange(opt); setActiveDropdown(null); }}
                  className="w-full px-4 py-3 rounded-lg text-left text-[10px] font-bold uppercase tracking-wider hover:bg-[#f8f9ff] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className={cn(value === opt ? "text-[#0058be]" : "text-[#424754]/60 group-hover:text-[#0b1c30]")}>{opt}</span>
                  {value === opt && <Check size={12} className="text-[#0058be]" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-content bg-bg-primary">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-10 text-left">
          <BackButton to="/" label="Back to Home" />
        </div>

        <div className="max-w-4xl mx-auto mb-20 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter text-[#0b1c30] leading-[1.05]">
            The <span className="text-[#424754]/60">Chronicles.</span>
          </h1>
          <p className="text-[#424754] text-sm max-w-xl mx-auto leading-relaxed font-semibold">
            Thoughts on systems design, AI architectures, and building products in public.
          </p>
        </div>

        {/* Search & Filter Panel */}
        <div 
          className={cn(
            "max-w-4xl mx-auto mb-24 border border-[#c2c6d6]/35 rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-200",
            (isFocused || search || selectedTag || selectedCategory) ? "border-[#c2c6d6]/50 shadow-md" : ""
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="p-6 flex items-center justify-between group">
            <div className="flex items-center gap-4 flex-1">
              <Search className={cn("transition-colors duration-200", isFocused ? "text-[#0058be]" : "text-[#424754]/30")} size={16} />
              <input 
                type="text" 
                placeholder="Search for articles, topics or tags..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className="w-full bg-transparent outline-none text-base font-semibold placeholder:text-[#424754]/40 text-[#0b1c30]"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className={cn("hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-secondary border border-[#c2c6d6]/20 text-[9px] font-bold tracking-wider uppercase transition-colors duration-200", (isFocused || search || selectedTag || selectedCategory) ? "text-[#0b1c30] border-[#c2c6d6]/35" : "text-[#424754]/40")}>
                <span className="text-[11px] font-bold">/</span> Focus
              </div>
              {(isFocused || search || selectedTag || selectedCategory) && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFocused(false);
                    setSearch("");
                    setSelectedTag(null);
                    setSelectedCategory(null);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] border border-[#dce9ff] text-[#0058be] transition-colors text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>

          {(isFocused || search || selectedTag || selectedCategory) && (
            <div className="border-t border-[#c2c6d6]/20">
              <div className="p-6 space-y-8 text-left">
                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  {allCategories.length > 0 && (
                    <CustomSelect 
                      label="Category" 
                      value={selectedCategory} 
                      options={allCategories} 
                      onChange={setSelectedCategory}
                      id="category"
                    />
                  )}
                  {allTags.length > 0 && (
                    <CustomSelect 
                      label="Tag" 
                      value={selectedTag} 
                      options={allTags} 
                      onChange={setSelectedTag}
                      id="tag"
                    />
                  )}
                </div>

                {/* Search Results (Live Matches) */}
                {search && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <div className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/60">Top Results</div>
                      <div className="text-[8px] font-bold uppercase tracking-wider text-[#0b1c30]">{filteredPosts.length} matches</div>
                    </div>
                    <div className="space-y-2">
                      {filteredPosts.length > 0 ? (
                        filteredPosts.slice(0, 4).map(post => (
                          <Link 
                            to={`/blog/${post.slug}`} 
                            key={post.id}
                            className="w-full px-4 py-3 rounded-xl flex items-center justify-between transition-colors group bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#c2c6d6]/20 hover:border-[#0058be]/20"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#c2c6d6]/20 shrink-0 relative">
                                <img src={post.coverImage} className="absolute inset-0 w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                              </div>
                              <div className="flex flex-col gap-0.5 text-left">
                                <span className="text-sm font-bold text-[#0b1c30] group-hover:text-[#0058be] transition-colors">{post.title}</span>
                                <span className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/60">{post.category}</span>
                              </div>
                            </div>
                            <ArrowRight size={12} className="text-[#424754]/40 group-hover:text-[#0058be] transition-all group-hover:translate-x-0.5" />
                          </Link>
                        ))
                      ) : (
                        <div className="p-8 text-center rounded-xl bg-bg-secondary border border-dashed border-[#c2c6d6]/35">
                          <p className="text-[#424754]/60 font-bold uppercase tracking-wider text-[8px]">No articles match your search</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(selectedTag || selectedCategory || search) && (
                  <div className="pt-2 flex justify-end">
                    <button 
                      onClick={() => { setSelectedTag(null); setSelectedCategory(null); setSearch(""); }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#c2c6d6]/25 text-[9px] font-bold uppercase tracking-wider text-[#0b1c30] transition-colors cursor-pointer"
                    >
                      Reset Search
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#c2c6d6]/30 rounded-[32px] overflow-hidden h-[400px] animate-pulse">
                <div className="aspect-video bg-bg-secondary" />
                <div className="p-6 space-y-4">
                  <div className="h-3 w-1/3 bg-bg-secondary rounded" />
                  <div className="h-6 w-full bg-bg-secondary rounded" />
                  <div className="h-3 w-full bg-bg-secondary rounded" />
                </div>
              </div>
            ))
          ) : filteredPosts.map(post => (
            <Link to={`/blog/${post.slug}`} key={post.id} className="group">
              <div className="bg-white border border-[#c2c6d6]/30 rounded-[32px] overflow-hidden hover:border-[#0058be]/20 hover:shadow-ambient hover:scale-[1.01] transition-all duration-300 h-full flex flex-col shadow-sm">
                <div className="aspect-video overflow-hidden relative bg-gray-100 border-b border-[#c2c6d6]/10">
                  <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-[#c2c6d6]/20 text-[8px] font-bold uppercase tracking-wider text-[#0b1c30]">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/60">
                      {Array.isArray(post.tags) ? post.tags[0] : post.tags}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-[#c2c6d6]/50" />
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/60">{formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="text-xl font-extrabold mb-3 group-hover:text-[#0058be] transition-colors leading-tight text-[#0b1c30] tracking-tight">
                    {post.title}
                  </h3>
                  <p className="text-[#424754] mb-6 line-clamp-3 text-xs leading-relaxed font-semibold">
                    {post.description || (post.blocks?.find((b: any) => b.type === 'text')?.content?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, '').substring(0, 160).replace(/\.+$/, '') + '...') || "Read the full article to explore this topic further."}
                  </p>
                  <div className="mt-auto flex items-center gap-1.5 text-[9px] font-bold text-[#424754]/60 group-hover:text-[#0058be] uppercase tracking-wider transition-colors">
                    Explore Story <ArrowRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {!loading && filteredPosts.length === 0 && (search || selectedTag || selectedCategory) && (
          <div className="text-center py-24 border border-[#c2c6d6]/35 rounded-[32px] bg-white">
            <p className="text-[#424754]/60 text-xs font-semibold">No articles found matching your criteria.</p>
          </div>
        )}
        
        {!loading && posts.length === 0 && !(search || selectedTag || selectedCategory) && (
          <div className="py-24">
            <SystemEmptyState title="Database Offline" />
          </div>
        )}
      </div>
    </div>
  );
};
