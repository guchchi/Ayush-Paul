import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { Play, ArrowRight } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

export const ContentEngineSection = () => {
  return (
    <Section id="content" glowVariant="bottom">
      <div className="section-header">
        <motion.div 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="badge"
        >
          Media & Knowledge
        </motion.div>
        <motion.h2 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          Content <span className="text-brand-primary">Engine</span>
        </motion.h2>
        <motion.p 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center"
        >
          Building media and technology at the intersection of education, earning, and modern digital infrastructure.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* YouTube Video Highlight */}
        <motion.div
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="glass-card p-6 md:p-10 border border-white/5 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="aspect-video bg-black/50 rounded-2xl mb-8 relative overflow-hidden border border-white/10 group-hover:border-brand-primary/30 transition-colors flex items-center justify-center">
            {/* Replace with actual video embed or thumbnail */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform relative z-10">
              <Play fill="currentColor" size={32} className="ml-2" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-4 tracking-tight">How Teachers & Creators Can Earn Smarter</h3>
          <p className="text-white/50 leading-relaxed font-medium mb-8">
            A deep dive into the systems, automations, and digital products transforming the knowledge economy.
          </p>
          
          <a href="https://www.youtube.com/@ALX-17" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-primary hover:text-white transition-colors">
            Watch on YouTube <ArrowRight size={16} />
          </a>
        </motion.div>

        {/* Blog Highlight */}
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between mb-8 px-2">
             <h3 className="text-2xl font-bold tracking-tight">Latest Insights</h3>
             <a href="/blog" className="text-sm font-bold uppercase tracking-widest text-white/50 hover:text-brand-primary transition-colors flex items-center gap-2">
                View All <ArrowRight size={16} />
             </a>
          </div>

          {[
            { title: "Architecting a Multi-Agent AI System", date: "May 2026", readTime: "8 min read" },
            { title: "Why Education Needs Better Digital Infrastructure", date: "April 2026", readTime: "5 min read" },
            { title: "Scaling Hardware-Software Bridges", date: "March 2026", readTime: "12 min read" }
          ].map((post, i) => (
            <motion.a
              key={i}
              href="/blog"
              variants={VARIANTS.fadeUp}
              className="block glass-card p-8 border border-white/5 hover:border-brand-primary/30 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg md:text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors tracking-tight">{post.title}</h4>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-brand-primary/50" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-black transition-all shrink-0">
                  <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};
