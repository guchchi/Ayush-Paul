import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowUpRight, Cpu, Flame, Layers, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, limit, onSnapshot } from '../../firebase';
import { VARIANTS } from '../../lib/motion-presets';

// Helper to dynamically select appropriate icon based on category/title
const getPostIcon = (category: string = "", title: string = "") => {
  const cat = category.toLowerCase();
  const t = title.toLowerCase();
  if (cat.includes("ai") || cat.includes("neural") || t.includes("prompt") || t.includes("ai")) {
    return <Cpu size={14} />;
  }
  if (cat.includes("seo") || cat.includes("growth") || t.includes("seo")) {
    return <Flame size={14} />;
  }
  if (cat.includes("automation") || cat.includes("webhook") || t.includes("workflow")) {
    return <Layers size={14} />;
  }
  return <BookOpen size={14} />;
};

// Helper to provide real cover images fallbacks for the canonical items
const getPostCoverImage = (slug: string = "", coverImage: string = "") => {
  if (coverImage) return coverImage;
  const s = slug.toLowerCase();
  if (s.includes("ai")) {
    return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80";
  }
  if (s.includes("seo")) {
    return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80";
  }
  if (s.includes("automation")) {
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80";
  }
  return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80";
};

const cleanHomeTitle = (slug: string = "", defaultTitle: string = "") => {
  const s = slug.toLowerCase();
  if (s.includes('website-launch')) {
    return "Building an AI-Powered Web Launch Framework";
  }
  if (s.includes('seo-checklist')) {
    return "The Ultimate Technical SEO Foundation Checklist";
  }
  if (s.includes('automation')) {
    return "Setting Up Automated Database Sync with Webhooks";
  }
  return defaultTitle;
};

export const HomeKnowledgeHubSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'blogPosts'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((post: any) => post.published !== false && post.id !== 'how-teachers-can-earn-money-online')
        .map((post: any) => ({
          ...post,
          title: cleanHomeTitle(post.slug || post.id, post.title)
        }))
        .slice(0, 3);
      setPosts(data);
      setIsLoading(false);
    }, () => setIsLoading(false));
    return () => unsubscribe();
  }, []);

  return (
    <Section id="blog" className="border-t border-white/5 bg-[#050505] relative overflow-hidden">
      
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-[-150px] w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-[-150px] w-96 h-96 bg-brand-primary/3 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16 lg:mb-20">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="ds-section-label"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Learning Hub
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="ds-section-h2"
          >
            The Learning <span className="italic font-extrabold text-brand-primary">Hub.</span>
          </motion.h2>

          <motion.p
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="ds-section-body max-w-2xl text-white/50"
          >
            Guides, notes, experiments, and case studies detailing how to build products and automate operations.
          </motion.p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-stretch">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-[#101010] border border-white/[0.08] rounded-[2rem] overflow-hidden backdrop-blur-md h-[420px]">
                <div className="aspect-video bg-white/5 w-full" />
                <div className="p-8 space-y-4">
                  <div className="h-4 w-1/3 bg-white/5 rounded-full" />
                  <div className="h-8 w-3/4 bg-white/5 rounded-full" />
                  <div className="h-4 w-full bg-white/5 rounded-full" />
                </div>
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map((post, idx) => {
              const isFirstCard = idx === 0;
              return (
                <motion.div
                  key={post.id}
                  variants={VARIANTS.fadeUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="h-full"
                >
                  <Link
                    to={`/blog/${post.slug || post.id}`}
                    className="ds-card ds-card-hover flex flex-col justify-between group h-full"
                  >
                    <div className="aspect-video w-full overflow-hidden relative bg-black/20 border-b border-white/5 shrink-0">
                      <img
                        src={getPostCoverImage(post.slug, post.coverImage)}
                        alt={post.title}
                        className="w-full h-full object-cover brightness-[0.85] contrast-[0.95] group-hover:brightness-95 group-hover:contrast-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'; }}
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                      
                      <div className="absolute top-6 left-6">
                        <span className="px-3.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-[9px] font-extrabold uppercase tracking-wider text-brand-primary">
                          {post.category || 'Article'}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 sm:p-10 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                            {getPostIcon(post.category, post.title)}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                            {post.category || 'Article'}
                          </span>
                        </div>

                        <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-tight leading-snug group-hover:text-brand-primary transition-colors duration-300 mb-6">
                          {post.title}
                        </h3>
                      </div>

                      {isFirstCard ? (
                        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                          <div className="flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors duration-300 select-none">
                            Read Article <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto select-none">
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
                            {post.readTime || '8 min read'}
                          </span>
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-black group-hover:border-brand-primary group-hover:shadow-[0_0_15px_rgba(0,194,255,0.25)] transition-all duration-300 ease-out">
                            <ArrowUpRight size={18} />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-20 bg-[#101010] border border-white/5 rounded-3xl">
              <span className="text-sm text-white/40 font-mono">No articles found in Learning Hub registry.</span>
            </div>
          )}
        </div>

      </div>
    </Section>
  );
};

export default HomeKnowledgeHubSection;
