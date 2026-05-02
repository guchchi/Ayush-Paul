import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { Zap, Layers } from 'lucide-react';
import { db, collection, query, orderBy, onSnapshot, limit } from "../../firebase";
import { VARIANTS } from '../../lib/motion-presets';
import { cn } from '../../lib/utils';

import { handleFirestoreError, formatDate } from "../../lib/firebase-utils";

export const UpdatesSection = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "updates"), orderBy("date", "desc"), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUpdates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || updates.length === 0) return null;

  return (
    <Section id="updates" className="py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-4 flex items-center gap-2">
              <Zap size={16} className="text-brand-primary" /> Active Log
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">Live <span className="text-brand-primary">Momentum.</span></h3>
          </div>
          <p className="max-w-md text-white/40 leading-relaxed font-medium">
            Real-time updates, engineering notes, and product releases straight from the building floor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {updates.map((update, i) => (
            <motion.div
              key={update.id}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[32px] glass-card border border-white/5 group hover:border-brand-primary/30 transition-all flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                  update.statusTag === 'Shipped' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                  update.statusTag === 'Building' ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" :
                  update.statusTag === 'Fix' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                  "bg-white/10 text-white/60 border border-white/10"
                )}>
                  {update.statusTag || 'Update'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{formatDate(update.date)}</span>
              </div>
              <h4 className="text-xl font-bold mb-4">{update.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1">{update.text}</p>
              
              {update.relatedProject && (
                <div className="pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest">
                  <Layers size={14} /> {update.relatedProject}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
