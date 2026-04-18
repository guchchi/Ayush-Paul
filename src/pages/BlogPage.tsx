import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, ChevronDown, Check } from "lucide-react";
import { collection, query, orderBy, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useSEO } from "../hooks/useSEO";
import { BackButton } from "../components/ui/back-button";
import { cn } from "../lib/utils";
import { handleFirestoreError, formatDate } from "../lib/firebase-utils";
import { OperationType } from "../types";

export const BlogPage = () => {
  useSEO({
    title: "Ayush Paul Blog | Ideas, AI & Engineering",
    description: "Ayush Paul's Blog discussing AI, Development, learning journey and featured projects."
  });
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = () => setActiveDropdown(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"), where("published", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "blogPosts");
    });
    return () => unsubscribe();
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
            "w-full bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-2xl py-5 px-7 flex items-center justify-between transition-all duration-300 group shadow-lg",
            isOpen ? "border-brand-primary/40 bg-white/[0.05] ring-4 ring-brand-primary/5 scale-[1.02]" : "hover:border-white/20 hover:bg-white/[0.04]"
          )}
        >
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">{label}</span>
            <span className="text-[13px] font-bold text-white/90 whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">
              {value || `All ${label}s`}
            </span>
          </div>
          <ChevronDown size={16} className={cn("text-white/20 group-hover:text-brand-primary transition-all duration-500", isOpen && "rotate-180 text-brand-primary")} />
        </button>
        
        {isOpen && (
          <div className="absolute top-[calc(100%+12px)] left-0 w-full min-w-[240px] bg-[#0E0E0E]/95 backdrop-blur-3xl border border-white/[0.08] rounded-3xl overflow-hidden z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="p-2 max-h-[320px] overflow-y-auto custom-scrollbar">
              <button 
                onClick={() => { onChange(null); setActiveDropdown(null); }}
                className="w-full px-5 py-4 rounded-xl text-left text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-white/[0.05] transition-all flex items-center justify-between group"
              >
                <span className={cn(!value ? "text-brand-primary" : "text-white/30 group-hover:text-white/50")}>All {label}s</span>
                {!value && <Check size={14} className="text-brand-primary" />}
              </button>
              {options.map((opt: string) => (
                <button 
                  key={opt}
                  onClick={() => { onChange(opt); setActiveDropdown(null); }}
                  className="w-full px-5 py-4 rounded-xl text-left text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-white/[0.05] transition-all flex items-center justify-between group"
                >
                  <span className={cn(value === opt ? "text-brand-primary" : "text-white/60 group-hover:text-white")}>{opt}</span>
                  {value === opt && <Check size={14} className="text-brand-primary" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-content bg-[#0A0A0A]">
      <div className="container mx-auto px-6">
        <div className="mb-10">
          <BackButton to="/" label="Back to Home" />
        </div>

        <div className="max-w-4xl mx-auto mb-20 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">The <span className="text-brand-primary">Blog</span></h1>
          <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto leading-relaxed">Thoughts on Artificial Intelligence, Engineering, and the Future of Students.</p>
        </div>

        <div 
          className={cn(
            "max-w-4xl mx-auto mb-24 border border-white/[0.08] rounded-[32px] bg-[#0C0C0C] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden backdrop-blur-3xl transition-all duration-500 ease-in-out",
            (isFocused || search || selectedTag || selectedCategory) ? "ring-2 ring-brand-primary/20" : ""
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="p-8 flex items-center justify-between group">
            <div className="flex items-center gap-6 flex-1">
              <Search className={cn("transition-colors duration-500", isFocused ? "text-brand-primary" : "text-white/20")} size={24} />
              <input 
                type="text" 
                placeholder="Search for articles, topics or tags..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className="w-full bg-transparent outline-none text-xl font-medium placeholder:text-white/10 text-white"
              />
            </div>
            <div className={cn("hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] font-bold tracking-widest uppercase transition-all duration-500", isFocused ? "text-brand-primary border-brand-primary/30" : "text-white/30")}>
              <span className="text-[14px]">/</span> Focus
            </div>
          </div>

          {(isFocused || search || selectedTag || selectedCategory) && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="h-px bg-white/[0.05]" />

              <div className="p-8 space-y-12">
                {/* Quick Actions (Categories) */}
                <div className="space-y-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 px-2">Topics</div>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={cn(
                        "px-6 py-3 rounded-2xl text-xs font-bold transition-all border",
                        !selectedCategory ? "bg-white text-black border-white" : "bg-white/[0.03] text-white/40 border-white/[0.05] hover:border-white/20 hover:bg-white/[0.05]"
                      )}
                    >
                      All Topics
                    </button>
                    {allCategories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "px-6 py-3 rounded-2xl text-xs font-bold transition-all border",
                          selectedCategory === cat ? "bg-brand-primary text-white border-brand-primary shadow-[0_0_20px_rgba(0,183,255,0.2)]" : "bg-white/[0.03] text-white/40 border-white/[0.05] hover:border-white/20 hover:bg-white/[0.05]"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Actions (Tags) */}
                <div className="space-y-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 px-2">Popular Tags</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {allTags.slice(0, 10).map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        className={cn(
                          "w-full px-5 py-4 rounded-xl flex items-center justify-between transition-all group border",
                          selectedTag === tag ? "bg-white/[0.05] border-brand-primary/30" : "bg-transparent border-transparent hover:bg-white/[0.03]"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("w-2 h-2 rounded-full transition-colors", selectedTag === tag ? "bg-brand-primary shadow-[0_0_8px_var(--color-brand-primary)]" : "bg-white/10 group-hover:bg-white/20")} />
                          <span className={cn("text-xs font-bold transition-colors uppercase tracking-[0.1em]", selectedTag === tag ? "text-white" : "text-white/40 group-hover:text-white/60")}>#{tag}</span>
                        </div>
                        {selectedTag === tag ? (
                          <Check size={14} className="text-brand-primary" />
                        ) : (
                          <div className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-white/20 tracking-widest uppercase transition-opacity">Select</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {(selectedTag || selectedCategory || search) && (
                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={() => { setSelectedTag(null); setSelectedCategory(null); setSearch(""); }}
                      className="flex items-center gap-3 px-6 py-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/60 hover:text-red-400 transition-all"
                    >
                      <span className="w-1 h-1 rounded-full bg-current" />
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <Link to={`/blog/${post.slug}`} key={post.id} className="group">
              <div className="glass-card rounded-3xl overflow-hidden border border-white/5 hover:border-brand-primary/30 transition-all h-full flex flex-col">
                <div className="aspect-video overflow-hidden relative">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">
                      {Array.isArray(post.tags) ? post.tags[0] : post.tags}
                    </span>
                    <span className="text-xs text-white/40 uppercase tracking-widest">{formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-primary transition-colors">{post.title}</h3>
                  <p className="text-white/60 mb-6 line-clamp-3">
                    {post.description || (post.blocks?.find((b: any) => b.type === 'text')?.content?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, '').substring(0, 160).replace(/\.+$/, '') + '...') || "Read the full article to explore this topic further."}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-sm font-bold text-brand-primary">
                    Read More <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <div className="text-center py-24 glass-card rounded-[40px] border border-white/5">
            <p className="text-white/40">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};


