import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, limit, onSnapshot, where } from '../../firebase';
import { VARIANTS } from '../../lib/motion-presets';



export const HomeActiveSystemsSection = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
      setIsLoading(false);
    }, () => setIsLoading(false));
    return () => unsubscribe();
  }, []);

  const displayProjects = projects.slice(0, 3);

  return (
    <Section id="active-systems" className="py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
          <div className="max-w-3xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">
              Engineering Outcomes
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Ecosystem Blueprints & <span className="text-brand-primary">Proof.</span>
            </h3>
            <p className="text-white/40 font-medium text-lg leading-relaxed mb-6">
              These are not isolated projects, but verified outcomes of a modular engineering ecosystem—spanning autonomous robotics, research telemetry, and educational blueprints.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 border-t border-white/5 pt-6 text-xs text-white/40">
              <div>
                <span className="font-bold text-white/70 block uppercase tracking-wider mb-1">Verifiable Impact</span>
                Every card represents a deployed physical or digital system with real-world validation.
              </div>
              <div>
                <span className="font-bold text-white/70 block uppercase tracking-wider mb-1">Who Gains</span>
                Clear user profiles mapping direct benefits to students, researchers, and partners.
              </div>
              <div>
                <span className="font-bold text-white/70 block uppercase tracking-wider mb-1">Action Paths</span>
                Explore technical case studies, download schemas, or sponsor active build nodes.
              </div>
            </div>
          </div>
          <Link
            to="/systems"
            className="flex items-center gap-2 text-white/40 hover:text-brand-primary font-bold tracking-widest uppercase text-xs transition-colors shrink-0"
          >
            View All Initiatives <ArrowRight size={16} />
          </Link>
        </div>

        {/* Symmetrical 3-Column Outcomes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {(isLoading ? Array.from({ length: 3 }) : displayProjects).map((project: any, i) =>
            isLoading ? (
              <div key={i} className="animate-pulse glass-card rounded-[32px] p-8 border border-white/5">
                <div className="aspect-[16/10] rounded-2xl bg-white/5 mb-8" />
                <div className="space-y-4">
                  <div className="h-3 w-1/3 bg-white/5 rounded-full" />
                  <div className="h-7 w-3/4 bg-white/5 rounded-full" />
                  <div className="space-y-2 pt-4">
                    <div className="h-4 w-full bg-white/5 rounded-full" />
                    <div className="h-4 w-5/6 bg-white/5 rounded-full" />
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                key={project.id}
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col h-full rounded-[32px] overflow-hidden glass-card border border-white/5 hover:border-brand-primary/20 transition-all duration-500 shadow-2xl relative"
              >
                {/* Image Section */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/20">
                  <img
                    src={project.image || '/assets/placeholder.jpg'}
                    alt={project.title}
                    className="w-full h-full object-cover brightness-[0.85] contrast-[0.95] group-hover:brightness-95 group-hover:contrast-100 transition-all duration-700 ease-out"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                  
                  {/* Neon Pinging Proof Tag Overlay */}
                  <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                    </span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.15em]">
                      {project.proofTag || 'Verified Build'}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow">
                  <span className="text-brand-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-3 block">
                    {project.category || 'System Outcome'}
                  </span>
                  
                  <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-primary transition-colors duration-300 tracking-tight">
                    {project.title}
                  </h4>

                  {/* Core Accomplishment Statement */}
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    {project.accomplishment || project.description || 'System successfully deployed.'}
                  </p>

                  {/* Verified Outcome Bullet */}
                  <div className="flex items-start gap-2.5 text-sm text-white/90 font-semibold leading-snug mb-8">
                    <span className="text-brand-primary font-bold mt-0.5">•</span>
                    <span>{project.outcome || 'Deployed functional models for system validation.'}</span>
                  </div>

                  {/* Action Link Button */}
                  <div className="pt-6 border-t border-white/5 mt-auto">
                    <Link
                      to={`/systems/${project.slug || project.id}`}
                      className="w-full flex items-center justify-between py-3 px-5 rounded-2xl bg-white/5 hover:bg-brand-primary/10 border border-white/10 hover:border-brand-primary/30 transition-all duration-300 text-xs font-bold text-white/80 hover:text-white uppercase tracking-widest group-hover:shadow-lg group-hover:shadow-brand-primary/5"
                    >
                      <span>{project.ctaText || 'View Case Study'}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </div>

      </div>
    </Section>
  );
};

export default HomeActiveSystemsSection;
