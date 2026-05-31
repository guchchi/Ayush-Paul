import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight, ChevronRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, limit, onSnapshot } from '../../firebase';
import { cn } from '../../lib/utils';
import { VARIANTS } from '../../lib/motion-presets';

const FALLBACK_UPDATES = [
  { id: 'f1', date: '2026', statusTag: 'Shipped', title: 'Website Ecosystem Launched', text: 'Full digital headquarters live — systems, labs, chronicles, and collaboration all unified.', relatedProject: 'Ecosystem' },
  { id: 'f2', date: '2026', statusTag: 'Building', title: 'Systems Catalog Expansion', text: 'Documenting WRO competition robots and custom embedded systems with full build journals.', relatedProject: 'Robotics' },
  { id: 'f3', date: '2026', statusTag: 'Building', title: 'Knowledge Hub Growth', text: 'Writing tutorials on Arduino prototyping and career frameworks for student founders.', relatedProject: 'Chronicles' },
  { id: 'f4', date: '2026', statusTag: 'Planning', title: 'Academic Robotics Kits', text: 'Designing modular hardware kits so students can learn embedded engineering through hands-on building.', relatedProject: 'Education' },
  { id: 'f5', date: '2025', statusTag: 'Shipped', title: 'INSPIRE Award Prototype', text: 'National-level award-winning solar micro-grid telemetry system recognized by the DST Government of India.', relatedProject: 'Innovation' },
];

const MILESTONES = [
  { year: '2021', title: 'National Science Exhibition', desc: 'First recognition for foundational hardware engineering work.' },
  { year: '2023', title: 'INSPIRE Award — MANAK', desc: 'Govt of India ₹10,000 innovation grant for the Iron Code solar prototype.' },
  { year: '2024', title: 'WRO Competition', desc: 'National-level competitive robotics with autonomous closed-loop control systems.' },
  { year: '2025', title: 'Ecosystem Launch', desc: 'Full digital headquarters deployed with systems, labs, and knowledge hub.' },
];

export const HomeMomentumSection = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'updates'), orderBy('date', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((item: any) => {
          const t = (item.title || '').toLowerCase();
          const txt = (item.text || '').toLowerCase();
          return !t.includes('test') && !txt.includes('test');
        });
      setUpdates(data);
      setIsLoading(false);
    }, () => setIsLoading(false));
    return () => unsubscribe();
  }, []);

  const activeUpdates = updates.length > 0 ? updates : FALLBACK_UPDATES;

  return (
    <Section id="momentum" className="py-32 border-t border-white/5 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header — mirrors MomentumBoard in CollaboratePage */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" /> Building in Public
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Ecosystem <span className="text-brand-primary italic">Progress.</span>
            </h3>
          </div>
          <p className="text-white/40 font-medium max-w-sm text-lg">
            Every shipped milestone, active build, and roadmap target — in full public view. No private wins here.
          </p>
        </div>

        {/* Milestone Timeline — mirrors About page MilestonesCarousel layout */}
        <div className="mb-24">
          <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-white/20 mb-12">
            Key Milestones
          </h4>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-white/10 z-0" />
            {MILESTONES.map((m, i) => (
              <motion.div
                key={i}
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full glass-card border border-white/10 bg-[#0A0A0A] flex items-center justify-center text-sm font-bold text-brand-primary group-hover:border-brand-primary/50 transition-colors mb-8 shadow-xl">
                  {m.year}
                </div>
                <h4 className="text-base font-bold mb-3 tracking-tight">{m.title}</h4>
                <p className="text-white/40 text-sm font-medium leading-relaxed max-w-[180px]">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Update Feed — mirrors MomentumBoard list style */}
        <div className="space-y-4">
          {activeUpdates.map((update, i) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 md:p-8 glass-card border-white/5 hover:border-brand-primary/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-[24px]"
            >
              <div className="flex items-start md:items-center gap-6 flex-1">
                <div className="hidden md:block w-24 text-[10px] font-bold uppercase tracking-widest text-white/20 shrink-0">
                  {update.date}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded border',
                      update.statusTag === 'Shipped' ? 'text-green-400 border-green-500/20 bg-green-500/5' :
                      update.statusTag === 'Building' ? 'text-brand-primary border-brand-primary/20 bg-brand-primary/5' :
                      update.statusTag === 'Fix' ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                      'text-white/30 border-white/10 bg-white/5'
                    )}>
                      {update.statusTag || 'Update'}
                    </span>
                    <h4 className="text-xl font-bold tracking-tight text-white/90">{update.title}</h4>
                  </div>
                  <p className="text-sm text-white/40 font-medium line-clamp-1">{update.text}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="md:hidden text-[10px] font-bold uppercase tracking-widest text-white/20">
                  {update.date}
                </div>
                {update.relatedProject && (
                  <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                    <Layers size={12} /> {update.relatedProject}
                  </div>
                )}
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/momentum"
            className="inline-flex items-center gap-2 text-white/40 hover:text-brand-primary font-bold tracking-widest uppercase text-xs transition-colors"
          >
            View Full Momentum Log <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </Section>
  );
};

export default HomeMomentumSection;
