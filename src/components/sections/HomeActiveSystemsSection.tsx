import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight, ChevronRight, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, limit, onSnapshot } from '../../firebase';
import { VARIANTS, EASING } from '../../lib/motion-presets';

// Fallback projects shown when Firestore has no data
const FALLBACK_PROJECTS = [
  {
    id: 'wro-robotics',
    category: 'Robotics & Engineering',
    title: 'WRO Competition Robots',
    description: 'Autonomous robots built for the World Robot Olympiad — closed-loop motor control, custom chassis, real-time sensor feedback. Competed at national level.',
    image: '/assets/projects/wro-robot.jpg',
    year: '2024',
    role: 'Solo Engineer',
    slug: 'wro-robotics',
    featured: true,
  },
  {
    id: 'inspire-solar',
    category: 'Innovation & Awards',
    title: 'INSPIRE Award Solar Grid',
    description: 'DST INSPIRE MANAK national award-winning prototype for automated remote solar load balancing. Recognized by the Government of India.',
    image: '/assets/projects/inspire-award.png',
    year: '2023',
    role: 'Inventor',
    slug: 'inspire-solar',
  },
  {
    id: 'arduino-embedded',
    category: 'Embedded Systems',
    title: 'Arduino & ESP32 Builds',
    description: 'Micro-controller based systems running sensor automation, motor control, and custom firmware routines. Hardware-software bridges that respond to the physical world.',
    image: '/assets/projects/arduino-builds.jpg',
    year: '2024',
    role: 'Builder',
    slug: 'arduino-embedded',
  },
  {
    id: 'web-platforms',
    category: 'Software & Web',
    title: 'Web Apps & Digital Tools',
    description: 'Full-stack web applications, developer tools, and AI-powered utilities built with React, TypeScript, and modern deployment pipelines.',
    image: '/assets/projects/web-apps.jpg',
    year: '2025',
    role: 'Full-Stack Developer',
    slug: 'web-platforms',
  },
];

export const HomeActiveSystemsSection = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
      setIsLoading(false);
    }, () => setIsLoading(false));
    return () => unsubscribe();
  }, []);

  const displayProjects = projects.length > 0 ? projects : FALLBACK_PROJECTS;
  const featuredProject = displayProjects.find(p => p.featured) || displayProjects[0];
  const gridProjects = displayProjects.filter(p => !p.featured).slice(0, 3);

  return (
    <Section id="active-systems" className="py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex justify-between items-end mb-20">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">
              Flagship Initiatives
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">
              What We're <span className="text-brand-primary">Building.</span>
            </h3>
          </div>
          <Link
            to="/systems"
            className="hidden md:flex items-center gap-2 text-white/40 hover:text-brand-primary font-bold tracking-widest uppercase text-xs transition-colors"
          >
            View All Initiatives <ArrowRight size={16} />
          </Link>
        </div>

        {/* Featured Project — Blueprint Showcase card */}
        {featuredProject && (
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mb-20 group relative rounded-[32px] lg:rounded-[60px] glass-card border-white/5 overflow-hidden shadow-2xl hover:border-brand-primary/20 transition-all duration-500"
          >
            <div className="grid lg:grid-cols-2">
              {/* Image side */}
              <div className="aspect-[4/3] lg:aspect-auto overflow-hidden relative">
                <img
                  src={featuredProject.image || '/assets/placeholder.jpg'}
                  alt={featuredProject.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-8 left-8">
                  <div className="px-5 py-2 rounded-full bg-brand-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">
                    Flagship Initiative
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className="p-10 lg:p-20 flex flex-col justify-center">
                <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-[11px] mb-6 block">
                  {featuredProject.category}
                </span>
                <h3 className="text-4xl lg:text-5xl font-bold text-white mb-8 tracking-tighter leading-tight">
                  {featuredProject.title}
                </h3>
                <p className="text-xl text-white/50 mb-12 leading-relaxed line-clamp-3 font-medium">
                  {featuredProject.description}
                </p>
                <Link
                  to={`/systems/${featuredProject.slug || featuredProject.id}`}
                  className="flex items-center gap-4 text-brand-primary font-bold text-lg group-hover:gap-6 transition-all uppercase tracking-widest"
                >
                  View Case Study <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid Projects — Blueprint Showcase style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {(isLoading ? Array.from({ length: 3 }) : gridProjects).map((project: any, i) =>
            isLoading ? (
              <div key={i} className="animate-pulse">
                <div className="aspect-video rounded-[32px] bg-white/5 mb-8" />
                <div className="space-y-4 px-2">
                  <div className="h-3 w-1/3 bg-white/5 rounded-full" />
                  <div className="h-7 w-3/4 bg-white/5 rounded-full" />
                  <div className="h-4 w-full bg-white/5 rounded-full" />
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
                className="group cursor-pointer"
              >
                <div className="aspect-video rounded-[32px] overflow-hidden mb-8 glass-card border-white/5 relative shadow-xl">
                  <img
                    src={project.image || '/assets/placeholder.jpg'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700" />
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                      <ArrowRight className="-rotate-45" size={20} />
                    </div>
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                      {project.category}
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-primary transition-colors tracking-tight">
                    {project.title}
                  </h4>
                  <p className="text-white/40 font-medium line-clamp-2 leading-relaxed mb-6">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-[0.25em]">
                      <Clock size={14} /> {project.year || '2024'}
                    </div>
                    <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-[0.25em]">
                      <User size={14} /> {project.role || 'Solo Build'}
                    </div>
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
