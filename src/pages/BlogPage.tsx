import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
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
      <div className="relative min-w-[200px]" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => setActiveDropdown(isOpen ? null : id)}
          className={cn(
            "w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 flex items-center justify-between transition-all group",
            isOpen ? "border-brand-primary/50 bg-white/[0.06]" : "hover:border-white/20"
          )}
        >
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">{label}</span>
            <span className="text-sm font-bold text-white/80 whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">
              {value || `All ${label}s`}
            </span>
          </div>
          <ChevronDown size={18} className={cn("text-white/20 group-hover:text-brand-primary transition-transform duration-300", isOpen && "rotate-180 text-brand-primary")} />
        </button>
        
        {isOpen && (
          <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-[#121212] border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              <button 
                onClick={() => { onChange(null); setActiveDropdown(null); }}
                className="w-full px-6 py-4 text-left text-xs font-bold uppercase tracking-widest hover:bg-white/[0.05] transition-colors flex items-center justify-between group"
              >
                <span className={cn(!value ? "text-brand-primary" : "text-white/40")}>All {label}s</span>
                {!value && <Check size={14} className="text-brand-primary" />}
              </button>
              {options.map((opt: string) => (
                <button 
                  key={opt}
                  onClick={() => { onChange(opt); setActiveDropdown(null); }}
                  className="w-full px-6 py-4 text-left text-xs font-bold uppercase tracking-widest hover:bg-white/[0.05] transition-colors border-t border-white/5 flex items-center justify-between group"
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

        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">The <span className="text-brand-primary">Blog</span></h1>
          <p className="text-white/60 text-xl">Exploring the intersection of AI, Robotics, and Entrepreneurship.</p>
        </div>

        <div className="glass-card rounded-[40px] p-8 mb-20 border border-white/5 relative z-50">
          <div className="flex flex-col xl:flex-row gap-8 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search articles, topics or tags..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-6 pl-14 pr-6 outline-none focus:border-brand-primary/50 transition-all text-xl placeholder:text-white/10"
              />
            </div>

            <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 w-full xl:w-auto">
              {/* Category Filter */}
              <CustomSelect 
                id="category"
                label="Topic"
                value={selectedCategory}
                options={allCategories}
                onChange={setSelectedCategory}
              />

              {/* Tag Dropdown Filter */}
              <CustomSelect 
                id="tag"
                label="Tag"
                value={selectedTag}
                options={allTags}
                onChange={setSelectedTag}
              />

              {(selectedTag || selectedCategory || search) && (
                <button 
                  onClick={() => { setSelectedTag(null); setSelectedCategory(null); setSearch(""); }}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary hover:text-white transition-all bg-brand-primary/10 hover:bg-brand-primary/20 px-8 py-4 rounded-xl"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
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


