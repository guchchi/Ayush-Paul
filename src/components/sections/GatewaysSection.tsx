import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight, BookOpen, FlaskConical, LayoutTemplate, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const GATEWAYS = [
  {
    id: 'about',
    title: 'About',
    description: 'Founder story, vision, and core principles.',
    icon: User,
    link: '/about',
    color: '#00C2FF',
    bgImg: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'blueprints',
    title: 'Blueprints',
    description: 'Core infrastructure and architectural blueprints.',
    icon: LayoutTemplate,
    link: '/blueprints',
    color: '#7B61FF',
    bgImg: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'experiments',
    title: 'Experiments / Projects',
    description: 'Active R&D pipelines and bleeding-edge prototypes.',
    icon: FlaskConical,
    link: '/experiments',
    color: '#FF003C',
    bgImg: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'blogs',
    title: 'Blogs',
    description: 'Technical writing, case studies, and insights.',
    icon: BookOpen,
    link: '/blog',
    color: '#00FF9D',
    bgImg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'
  }
];

export const GatewaysSection = () => {
  return (
    <Section id="gateways" className="py-24 bg-[#0A0A0B] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge shadow-[0_0_20px_rgba(0,194,255,0.08)] bg-white/[0.01] border border-white/[0.06] text-[10px] font-bold uppercase tracking-widest text-[#00C2FF] flex items-center gap-1.5 px-4 py-2 rounded-full mb-6 w-fit"
          >
            <LayoutTemplate size={14} className="text-[#00C2FF]" /> UNIFIED PORTAL
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-[1.08] uppercase">
            Explore the <span className="text-[#00C2FF] font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.2)' }}>Ecosystem.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {GATEWAYS.map((gateway, idx) => {
            const Icon = gateway.icon;
            return (
              <motion.div
                key={gateway.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group relative h-[280px] lg:h-[320px] rounded-2xl overflow-hidden border border-white/[0.05] bg-white/[0.02]"
              >
                {/* Background Image & Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 ease-[--ease-premium]"
                  style={{ backgroundImage: `url(${gateway.bgImg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

                {/* Content */}
                <Link to={gateway.link} className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0A0A0B] border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors duration-500"
                          style={{ boxShadow: `0 0 20px ${gateway.color}20` }}
                        >
                          <Icon size={18} style={{ color: gateway.color }} />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight uppercase">
                          {gateway.title}
                        </h3>
                      </div>
                      <p className="text-white/50 font-medium max-w-sm group-hover:text-white/70 transition-colors duration-300">
                        {gateway.description}
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] backdrop-blur-md group-hover:bg-white/10 group-hover:border-white/30 group-hover:scale-110 transition-all duration-500">
                      <ArrowRight size={20} className="text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />
                    </div>
                  </div>
                </Link>

                {/* Hover Glow Edge */}
                <div 
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-[--ease-premium]"
                  style={{ backgroundColor: gateway.color, boxShadow: `0 0 20px ${gateway.color}` }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
