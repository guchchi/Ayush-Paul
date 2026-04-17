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
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.description?.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));

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

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-brand-primary transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedTag(null)}
              className={cn("px-6 py-4 rounded-2xl font-bold text-sm transition-all", !selectedTag ? "bg-brand-primary text-white" : "bg-white/5 text-white/40 border border-white/10")}
            >
              All
            </button>
            {allTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={cn("px-6 py-4 rounded-2xl font-bold text-sm transition-all", selectedTag === tag ? "bg-brand-primary text-white" : "bg-white/5 text-white/40 border border-white/10")}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <Link to={`/blog/${post.slug}`} key={post.id} className="group">
              <div className="glass-card rounded-3xl overflow-hidden border border-white/5 hover:border-brand-primary/30 transition-all h-full flex flex-col">
                <div className="aspect-video overflow-hidden">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">{post.tags?.(0)}</span>
                    <span className="text-xs text-white/40 uppercase tracking-widest">{formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-primary transition-colors">{post.title}</h3>
                  <p className="text-white/60 mb-6 line-clamp-3">{post.description}</p>
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


