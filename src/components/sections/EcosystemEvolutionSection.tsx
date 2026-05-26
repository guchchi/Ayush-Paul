import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { History, ShieldCheck, Layers, GitCommit } from 'lucide-react';
import { db, collection, query, orderBy, onSnapshot, limit } from "../../firebase";
import { VARIANTS } from '../../lib/motion-presets';
import { cn } from '../../lib/utils';

export const EcosystemEvolutionSection = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "updates"), orderBy("date", "desc"), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUpdates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || updates.length === 0) return null;

  return (
    <Section id="ecosystem-milestones" className="py-24 border-t border-white/5 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-4 flex items-center gap-2">
              <History size={16} className="text-brand-primary" /> System Chronology
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">Ecosystem <span className="text-brand-primary">Milestones.</span></h3>
          </div>
          <p className="max-w-md text-white/40 leading-relaxed font-medium">
            Chronological registry of architectural breakthroughs, deployed nodes, and physical system expansions.
          </p>
        </div>

        {/* Industrial Vertical Timeline Layout */}
        <div className="relative max-w-4xl mx-auto pl-8 sm:pl-10 border-l border-white/5 space-y-16">
          {updates.map((update, i) => {
            const tag = update.statusTag || 'Milestone';
            const isShipped = tag === 'Shipped';
            
            return (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                {/* Timeline Dot Node */}
                <div className="absolute -left-[41px] sm:-left-[45px] top-1.5 w-6 h-6 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center group-hover:border-brand-primary/40 transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover:bg-brand-primary animate-pulse transition-colors" />
                </div>

                {/* Milestone Card Content */}
                <div className="p-8 rounded-[32px] bg-[#0D0D0E] border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-start gap-6 group shadow-xl">
                  
                  {/* Left Metadata Panel (Mobile/Desktop friendly) */}
                  <div className="sm:w-36 shrink-0 space-y-2">
                    <div className="text-[10px] font-mono font-bold tracking-wider text-white/30">{update.date}</div>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider border",
                      isShipped ? "bg-green-500/5 text-green-400 border-green-500/25" : "bg-brand-primary/5 text-brand-primary border-brand-primary/25"
                    )}>
                      <GitCommit size={10} /> {tag}
                    </span>
                  </div>

                  {/* Right Details Panel */}
                  <div className="flex-grow space-y-3">
                    <h4 className="text-xl font-bold tracking-tight text-white leading-snug group-hover:text-brand-primary transition-colors">
                      {update.title}
                    </h4>
                    <p className="text-white/45 text-sm leading-relaxed font-medium">
                      {update.text}
                    </p>

                    {/* Infrastructure Tag References */}
                    {update.relatedProject && (
                      <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
                        <Layers size={12} className="text-brand-primary/60" /> {update.relatedProject}
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </Section>
  );
};
