import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { Terminal, Layers, RefreshCw } from 'lucide-react';
import { db, collection, query, orderBy, onSnapshot, limit } from "../../firebase";
import { VARIANTS } from '../../lib/motion-presets';
import { cn } from '../../lib/utils';

export const UpdatesSection = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "updates"), orderBy("date", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUpdates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || updates.length === 0) return null;

  return (
    <Section id="engineering-logs" className="py-24 border-t border-white/5 bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-4 flex items-center gap-2">
              <Terminal size={16} className="text-brand-primary animate-pulse" /> Active Build Stream
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">Engineering <span className="text-brand-primary">Logs.</span></h3>
          </div>
          <p className="max-w-md text-white/40 leading-relaxed font-medium">
            Real-time shipped modules, runtime diagnostics, and structural compile commits synced straight from the laboratory floor.
          </p>
        </div>

        {/* Monospace Developer Console Layout */}
        <div className="w-full bg-[#070708] border border-white/5 rounded-[28px] overflow-hidden shadow-2xl relative">
          
          {/* Console Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.01]">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/30">INTELLIGENCE_DEPLOY_STREAM</span>
            <div className="flex items-center gap-2">
              <RefreshCw size={10} className="text-brand-primary animate-spin" />
              <span className="text-[9px] font-mono text-brand-primary font-bold">MONITORING ACTIVE</span>
            </div>
          </div>

          {/* Console Rows Stack */}
          <div className="p-6 md:p-8 font-mono text-xs divide-y divide-white/5">
            {updates.map((update, i) => {
              const tag = update.statusTag || 'Update';
              const isShipped = tag === 'Shipped';
              const isBuilding = tag === 'Building';
              const isFix = tag === 'Fix';

              return (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="py-6 flex flex-col md:flex-row md:items-start gap-4 md:gap-8 hover:bg-white/[0.01] transition-colors px-4 rounded-xl"
                >
                  {/* Column 1: Time & Status Badge */}
                  <div className="flex items-center gap-3 md:w-44 shrink-0">
                    <span className="text-[10px] text-white/20 font-bold shrink-0">{update.date}</span>
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border font-mono shrink-0",
                      isShipped ? "bg-green-500/5 text-green-400 border-green-500/25" :
                      isBuilding ? "bg-brand-primary/5 text-brand-primary border-brand-primary/25" :
                      isFix ? "bg-red-500/5 text-red-400 border-red-500/25" :
                      "bg-white/5 text-white/40 border-white/10"
                    )}>
                      {tag}
                    </span>
                  </div>

                  {/* Column 2: Log Details & Description */}
                  <div className="flex-1 space-y-2">
                    <div className="text-sm font-bold text-white tracking-tight">{update.title}</div>
                    <div className="text-white/45 leading-relaxed text-[11px] font-medium tracking-wide">
                      {update.text}
                    </div>
                  </div>

                  {/* Column 3: Telemetry Node Ref */}
                  {update.relatedProject && (
                    <div className="md:w-48 shrink-0 flex items-center md:justify-end gap-1.5 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] pt-2 md:pt-0">
                      <Layers size={12} className="text-brand-primary/50" />
                      <span className="truncate">{update.relatedProject}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Console Footer */}
          <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[9px] font-mono text-white/20">
            <span>TOTAL_RECORDS: {updates.length}</span>
            <span>SYSTEM_TIME: {new Date().toISOString()}</span>
          </div>

        </div>

      </div>
    </Section>
  );
};
