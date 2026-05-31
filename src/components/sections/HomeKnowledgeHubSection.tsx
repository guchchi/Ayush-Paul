import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, limit, onSnapshot } from '../../firebase';
import { VARIANTS } from '../../lib/motion-presets';

// Fallback articles for when Firestore has no published posts
const FALLBACK_ARTICLES = [
  {
    id: 'pid-tuning',
    category: 'Robotics & Engineering',
    title: 'PID Tuning for Arduino Servo Control',
    description: 'How to tune Proportional-Integral-Derivative parameters for closed-loop motor control on Arduino and ESP32 platforms. Real examples from competition builds.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    readTime: '8 min',
    date: 'May 2026',
    featured: true,
  },
  {
    id: 'student-to-founder',
    category: 'Student Growth',
    title: 'From Student to Builder: A Practical Roadmap',
    description: 'A framework for students transitioning into founders — structuring learning sprints, finding mentors, and building publicly to gain momentum.',
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=80',
    readTime: '6 min',
    date: 'May 2026',
  },
  {
    id: 'vector-embeddings',
    category: 'AI & Technology',
    title: 'Understanding Vector Embeddings & Semantic Search',
    description: 'A practical introduction to high-dimensional vector spaces, cosine similarity, and how to build semantic search tools using modern embedding APIs.',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&q=80',
    readTime: '10 min',
    date: 'April 2026',
  },
];

export const HomeKnowledgeHubSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((post: any) => post.published !== false);
      setPosts(data);
      setIsLoading(false);
    }, () => setIsLoading(false));
    return () => unsubscribe();
  }, []);

  const displayPosts = posts.length > 0 ? posts : FALLBACK_ARTICLES;
  const featuredPost = displayPosts.find((p: any) => p.featured) || displayPosts[0];
  const gridPosts = displayPosts.filter((p: any) => p.id !== featuredPost?.id).slice(0, 2);

  return (
    <Section id="knowledge-hub" className="py-32 border-t border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex justify-between items-end mb-20">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">
              Open Knowledge Platform
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">
              The Open <span className="text-brand-primary">Curriculum.</span>
            </h3>
          </div>
          <Link
            to="/blog"
            className="hidden md:flex items-center gap-2 text-white/40 hover:text-brand-primary font-bold tracking-widest uppercase text-xs transition-colors"
          >
            Access Full Library <ArrowRight size={16} />
          </Link>
        </div>

        {/* Featured Article — Blueprint Showcase style */}
        {featuredPost && (
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mb-20 group relative rounded-[32px] lg:rounded-[60px] glass-card border-white/5 overflow-hidden shadow-2xl hover:border-brand-primary/20 transition-all duration-500"
          >
            <div className="grid lg:grid-cols-2">
              {/* Image side */}
              <div className="aspect-[4/3] lg:aspect-auto overflow-hidden relative">
                <img
                  src={featuredPost.image || featuredPost.coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-8 left-8">
                  <div className="px-5 py-2 rounded-full bg-brand-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">
                    Free to Access
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className="p-10 lg:p-20 flex flex-col justify-center">
                <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-[11px] mb-6 block">
                  {featuredPost.category || featuredPost.tags?.[0] || 'Knowledge'}
                </span>
                <h3 className="text-3xl lg:text-5xl font-bold text-white mb-8 tracking-tighter leading-tight">
                  {featuredPost.title}
                </h3>
                <p className="text-xl text-white/50 mb-8 leading-relaxed line-clamp-3 font-medium">
                  {featuredPost.description || featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 mb-10">
                  <span className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                    <Clock size={12} /> {featuredPost.readTime || '5 min read'}
                  </span>
                  <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                    {featuredPost.date || featuredPost.publishedAt}
                  </span>
                </div>
                <Link
                  to={`/blog/${featuredPost.slug || featuredPost.id}`}
                  className="flex items-center gap-4 text-brand-primary font-bold text-base group-hover:gap-6 transition-all uppercase tracking-widest"
                >
                  Read Article <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid Articles */}
        <div className="grid md:grid-cols-2 gap-12">
          {(isLoading ? Array.from({ length: 2 }) : gridPosts).map((post: any, i) =>
            isLoading ? (
              <div key={i} className="animate-pulse">
                <div className="aspect-video rounded-[32px] bg-white/5 mb-8" />
                <div className="space-y-4 px-2">
                  <div className="h-3 w-1/3 bg-white/5 rounded-full" />
                  <div className="h-7 w-3/4 bg-white/5 rounded-full" />
                  <div className="h-4 w-full bg-white/5 rounded-full" />
                </div>
              </div>
            ) : (
              <motion.div
                key={post.id}
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={`/blog/${post.slug || post.id}`}>
                  <div className="aspect-video rounded-[32px] overflow-hidden mb-8 glass-card border-white/5 relative shadow-xl">
                    <img
                      src={post.image || post.coverImage || 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700" />
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                        <ArrowRight className="-rotate-45" size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                        {post.category || post.tags?.[0] || 'Article'}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">
                        <Clock size={10} /> {post.readTime || '5 min'}
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-primary transition-colors tracking-tight">
                      {post.title}
                    </h4>
                    <p className="text-white/40 font-medium line-clamp-2 leading-relaxed mb-6">
                      {post.description || post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-brand-primary text-[10px] font-bold uppercase tracking-widest pt-6 border-t border-white/5">
                      Read Article <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          )}
        </div>

      </div>
    </Section>
  );
};

export default HomeKnowledgeHubSection;
