import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight, Calendar, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, query, onSnapshot } from "../../firebase";
import { VARIANTS } from '../../lib/motion-presets';
import { handleFirestoreError, formatDate } from "../../lib/firebase-utils";
import { OperationType } from "../../types";

export const ResearchPublicationsSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "blogPosts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((post: any) => post.published !== false)
        .sort((a: any, b: any) => {
          const getMillis = (date: any) => {
            if (!date) return 0;
            if (typeof date.toMillis === 'function') return date.toMillis();
            if (typeof date.toDate === 'function') return date.toDate().getTime();
            if (date.seconds) return date.seconds * 1000;
            if (date._seconds) return date._seconds * 1000;
            const parsed = new Date(date).getTime();
            return isNaN(parsed) ? 0 : parsed;
          };
          return getMillis(b.createdAt) - getMillis(a.createdAt);
        })
        .slice(0, 3);
      
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
      <Section id="research-publications" className="py-24 border-t border-white/5 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center py-20">
          <div className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-8">
            Publication Desk
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">Publications <span className="text-brand-primary italic">Pending</span></h2>
          <p className="text-white/40 text-lg md:text-xl font-medium max-w-xl mx-auto">
            Deep technical insights and project logs are currently being prepared for catalog alignment.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="research-publications" className="py-24 border-t border-white/5 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-4 flex items-center gap-2">
              <BookOpen size={14} className="text-brand-primary" /> Engineering Notes & Papers
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">Research <span className="text-brand-primary">Publications.</span></h3>
          </div>
          <Link to="/blog" className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            Access Full Library <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Editorial Publications Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-[#0D0D0E] border border-white/5 hover:border-brand-primary/30 rounded-[32px] overflow-hidden transition-all flex flex-col h-full shadow-2xl"
              style={{ willChange: 'transform' }}
            >
              <Link to={`/blog/${post.slug || post.id}`} className="flex flex-col h-full">
                <div className="aspect-video relative overflow-hidden bg-white/[0.02]">
                  {post.coverImage ? (
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      loading="lazy" 
                      className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="text-brand-primary font-bold opacity-50">Technical Paper</span>
                    </div>
                  )}
                  {post.category && (
                    <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-bold uppercase tracking-widest text-white/80 border border-white/10">
                      {post.category}
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">
                    <Calendar size={12} className="text-brand-primary/60" /> {formatDate(post.createdAt)}
                  </div>
                  
                  <h4 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h4>
                  
                  <p className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-3 flex-1 font-medium">
                    {post.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-primary flex items-center gap-2 group-hover:text-white transition-colors">
                      Read Paper <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
