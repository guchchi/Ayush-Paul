import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Clock, Rocket, Search, Terminal, ChevronRight } from 'lucide-react';
import { db, collection, query, where, orderBy, getDocs, limit } from '../firebase';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';

interface MomentumLog {
  id: string;
  title: string;
  text: string;
  statusTag: string;
  date: string;
  isPublic: boolean;
  timestamp: any;
}

export const MomentumPage = () => {
  const [logs, setLogs] = useState<MomentumLog[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: "Momentum | Building in Public",
    description: "The live engineering log of Ayush Paul. Real-time updates on robotics, software systems, and laboratory progress.",
    canonicalUrl: getCanonicalUrl("/momentum")
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(
          collection(db, "updates"), 
          where("isPublic", "==", true),
          orderBy("timestamp", "desc"),
          limit(50)
        );
        const snapshot = await getDocs(q);
        setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MomentumLog)));
      } catch (err) {
        console.error("Error fetching momentum logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#0A0A0A] pt-32 pb-32"
    >
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 mb-8"
          >
            <Zap size={32} className="text-brand-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Momentum</h1>
          <p className="text-lg text-white/40 max-w-xl">
            A live feed of engineering velocity. Curated updates from the lab as I build the next generation of robotics and SaaS systems.
          </p>
        </div>

        {/* Timeline Section */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-0 sm:left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 hidden sm:block" />

          {loading ? (
            <div className="space-y-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex flex-col sm:flex-row items-center gap-8 opacity-20">
                   <div className="w-full sm:w-1/2 h-32 bg-white/10 rounded-3xl" />
                   <div className="w-4 h-4 rounded-full bg-white/20" />
                   <div className="w-full sm:w-1/2" />
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="p-20 text-center rounded-[3rem] border border-dashed border-white/5">
              <Terminal size={48} className="text-white/10 mx-auto mb-6" />
              <p className="text-white/20 font-bold uppercase tracking-widest text-xs">No public signals detected yet.</p>
            </div>
          ) : (
            <div className="space-y-24">
              {logs.map((log, index) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-8 ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                >
                  {/* Content Card */}
                  <div className="w-full sm:w-[calc(50%-2rem)] group">
                    <div className="p-8 rounded-[2.5rem] glass border border-white/5 hover:border-brand-primary/30 transition-all relative overflow-hidden">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20">
                          {log.statusTag}
                        </span>
                        <div className="flex items-center gap-1.5 text-white/20">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold">{log.date}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">{log.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{log.text}</p>
                      
                      <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">
                        Proof of Work <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden sm:flex w-16 items-center justify-center relative z-10">
                    <div className="w-4 h-4 rounded-full bg-[#0A0A0A] border-2 border-brand-primary shadow-[0_0_15px_rgba(0,194,255,0.3)]" />
                  </div>

                  {/* Empty Spacer for desktop alignment */}
                  <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {!loading && logs.length > 0 && (
          <div className="mt-32 p-12 rounded-[3rem] bg-brand-primary/5 border border-brand-primary/20 text-center">
            <Rocket size={32} className="text-brand-primary mx-auto mb-6" />
            <h4 className="text-xl font-bold mb-2">Want to build the future together?</h4>
            <p className="text-sm text-white/40 mb-8 max-w-sm mx-auto">Subscribe to get notified whenever a new blueprint or engineering update drops.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-brand-primary"
              />
              <button className="px-8 py-4 bg-brand-primary text-black rounded-2xl font-bold text-sm hover:bg-white transition-colors">
                Join Lab
              </button>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};
