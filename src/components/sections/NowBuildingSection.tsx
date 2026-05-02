import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { Activity, ArrowRight } from 'lucide-react';
import { db, collection, query, where, onSnapshot, limit } from "../../firebase";
import { VARIANTS } from '../../lib/motion-presets';

export const NowBuildingSection = () => {
  const [activeBuilds, setActiveBuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Specifically fetch items with 'Building' status
    const q = query(
      collection(db, "updates"), 
      where("statusTag", "==", "Building"),
      limit(3)
    );
    
    const unsubscribe = onSnapshot(q, (snap) => {
      setActiveBuilds(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || activeBuilds.length === 0) return null;

  return (
    <Section id="now-building" className="py-32 bg-gradient-to-b from-transparent to-brand-primary/[0.02]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
            <Activity size={24} className="animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold tracking-tighter">Now Building</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {activeBuilds.map((item, i) => (
            <motion.div
              key={item.id}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 glass-card rounded-[40px] border-white/5 space-y-6 group hover:border-brand-secondary/30 transition-all bg-white/[0.01]"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold tracking-tight group-hover:text-brand-secondary transition-colors">{item.title}</h3>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.date}</span>
              </div>
              <p className="text-white/40 font-medium leading-relaxed min-h-[80px]">{item.text}</p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-secondary tracking-widest uppercase pt-6 border-t border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-ping" />
                Live R&D
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
