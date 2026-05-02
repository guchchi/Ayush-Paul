import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { History, Zap, Layers, BookOpen, Star, ArrowUpRight } from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy, limit } from "../../firebase";
import { VARIANTS } from '../../lib/motion-presets';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export const ActivityTimelineSection = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to all three collections
    const qBlogs = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"), limit(5));
    const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(5));
    const qUpdates = query(collection(db, "updates"), orderBy("date", "desc"), limit(10));

    let blogs: any[] = [];
    let projects: any[] = [];
    let updates: any[] = [];

    const updateAll = () => {
      const combined = [
        ...blogs.map(b => ({ ...b, type: 'blog', timestamp: b.createdAt })),
        ...projects.map(p => ({ ...p, type: 'project', timestamp: p.createdAt })),
        ...updates.map(u => ({ ...u, type: 'update', timestamp: u.date }))
      ];
      
      // Sort by timestamp descending
      combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(combined.slice(0, 10));
      setLoading(false);
    };

    const unsubBlogs = onSnapshot(qBlogs, (snap) => {
      blogs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      updateAll();
    });
    const unsubProjects = onSnapshot(qProjects, (snap) => {
      projects = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      updateAll();
    });
    const unsubUpdates = onSnapshot(qUpdates, (snap) => {
      updates = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      updateAll();
    });

    return () => {
      unsubBlogs();
      unsubProjects();
      unsubUpdates();
    };
  }, []);

  if (loading || activities.length === 0) return null;

  return (
    <Section id="activity" className="py-32 border-t border-white/5 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-20">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <History size={28} />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-1">Live Feed</h2>
            <h3 className="text-4xl font-bold tracking-tighter">Recent <span className="text-brand-primary">Activity.</span></h3>
          </div>
        </div>

        <div className="relative space-y-12 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-brand-primary/50 before:via-white/5 before:to-transparent">
          {activities.map((item, i) => (
            <motion.div
              key={`${item.type}-${item.id}`}
              variants={VARIANTS.fadeRight}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative pl-16 group"
            >
              {/* Timeline Node */}
              <div className={cn(
                "absolute left-0 top-1 w-10 h-10 rounded-xl flex items-center justify-center z-10 transition-transform group-hover:scale-110",
                item.type === 'blog' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                item.type === 'project' ? "bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20" :
                "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
              )}>
                {item.type === 'blog' ? <BookOpen size={18} /> :
                 item.type === 'project' ? <Star size={18} /> :
                 <Zap size={18} />}
              </div>

              <div className="glass-card p-8 rounded-[32px] border border-white/5 group-hover:border-white/10 transition-all max-w-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{item.type}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{item.timestamp}</span>
                  </div>
                  {item.type !== 'update' && (
                    <Link to={item.type === 'blog' ? `/blog/${item.slug || item.id}` : `/projects/${item.slug || item.id}`}>
                      <ArrowUpRight size={16} className="text-white/20 group-hover:text-brand-primary transition-colors" />
                    </Link>
                  )}
                </div>
                
                <h4 className="text-xl font-bold mb-2 tracking-tight group-hover:text-white transition-colors">
                  {item.title}
                </h4>
                <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                  {item.type === 'update' ? item.text : item.description}
                </p>

                {item.type === 'update' && item.statusTag && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">{item.statusTag}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
