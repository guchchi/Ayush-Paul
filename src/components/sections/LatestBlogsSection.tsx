import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight, Calendar, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, where, onSnapshot, limit } from "../../firebase";
import { VARIANTS } from '../../lib/motion-presets';
import { handleFirestoreError, formatDate } from "../../lib/firebase-utils";
import { OperationType } from "../../types";

export const LatestBlogsSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "blogPosts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(3)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "blogPosts");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  if (posts.length === 0) {
    return (
      <Section id="latest-blogs" className="py-24 border-t border-white/5 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center py-20">
          <div className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-8">
            Content Pipeline
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">Signals <span className="text-brand-primary italic">Incoming</span></h2>
          <p className="text-white/40 text-lg md:text-xl font-medium max-w-xl mx-auto">
            Deep technical insights and project logs are currently being processed. Stay in the loop via the newsletter below.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="latest-blogs" className="py-24 border-t border-white/5 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-4">
              Thinking out loud
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">Latest <span className="text-brand-primary">Insights.</span></h3>
          </div>
          <Link to="/blog" className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            View All Posts <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative glass-card rounded-[32px] overflow-hidden border border-white/5 hover:border-brand-primary/30 transition-all flex flex-col h-full"
              style={{ willChange: 'transform' }}
            >
              <Link to={`/blog/${post.slug || post.id}`} className="flex flex-col h-full">
                <div className="aspect-[16/9] relative overflow-hidden">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={`${post.title} | Blog by Ayush Paul`} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center">
                      <span className="text-brand-primary font-bold opacity-50">No Cover Image</span>
                    </div>
                  )}
                  {post.category && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/80 border border-white/10">
                      {post.category}
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">
                    <Calendar size={12} /> {formatDate(post.createdAt)}
                  </div>
                  
                  <h4 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-brand-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  
                  <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {post.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-primary flex items-center gap-2">
                      Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
