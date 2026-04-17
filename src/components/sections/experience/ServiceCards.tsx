import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Rocket, Code, Sparkles, BrainCircuit, ArrowUpRight } from 'lucide-react';
import { VARIANTS, EASING } from '../../../lib/motion-presets';

const services = [
  {
    title: "AI & Automation",
    description: "Developing custom LLM integrations, autonomous agents, and intelligent workflows to streamline complex processes.",
    icon: <BrainCircuit size={28} />,
    accent: "var(--color-brand-primary)",
    tags: ["LLMs", "RAG", "Agents"]
  },
  {
    title: "Full-Stack Development",
    description: "Architecting scalable web applications with modern stacks, focusing on performance, SEO, and ultra-premium UX.",
    icon: <Code size={28} />,
    accent: "var(--color-brand-secondary)",
    tags: ["Next.js", "TypeScript", "Tailwind"]
  },
  {
    title: "Robotics & Hardware",
    description: "Building Arduino and Raspberry Pi powered systems, IoT integrations, and automation hardware.",
    icon: <Cpu size={28} />,
    accent: "var(--color-brand-accent)",
    tags: ["Embedded", "IoT", "Arduino"]
  },
  {
    title: "Digital Strategy",
    description: "Providing high-signal consulting for brand identity, product-led growth, and tech-driven marketing.",
    icon: <Rocket size={28} />,
    accent: "var(--color-brand-primary)",
    tags: ["Product", "Growth", "Branding"]
  }
];

export const ServiceCards = () => {
  return (
    <motion.div 
      variants={VARIANTS.staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12"
    >
      {services.map((service, i) => (
        <motion.div
          key={i}
          variants={VARIANTS.fadeUp}
          whileHover={VARIANTS.lift.whileHover}
          whileTap={{ scale: 0.98 }}
          transition={{ 
            ...VARIANTS.fadeUp.transition,
            delay: i * 0.1 
          }}
          className="group relative p-6 md:p-12 rounded-[32px] md:rounded-[48px] glass-card border border-white/5 hover:border-white/10 transition-all duration-500 shadow-2xl w-full max-w-full min-w-0 break-words overflow-hidden"
        >
          {/* Card Accent Glow */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 blur-[80px] -z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
            style={{ backgroundColor: service.accent }}
          />

          {/* Card Header */}
          <div className="flex items-start justify-between mb-8 md:mb-10 min-w-0">
            <div 
              className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-500 shadow-lg"
              style={{ backgroundColor: `${service.accent}15`, color: service.accent }}
            >
              {service.icon}
            </div>
            <div className="flex flex-col items-end gap-2 min-w-0 overflow-hidden">
              <div className="flex flex-wrap justify-end gap-2">
                {service.tags.map(tag => (
                  <span key={tag} className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
              <ArrowUpRight className="text-white/10 group-hover:text-white/40 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0" size={20} />
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 group-hover:text-brand-primary transition-colors tracking-tight break-words">
            {service.title}
          </h3>
          <p className="text-white/40 leading-relaxed text-base md:text-lg mb-8 md:mb-10 font-medium line-clamp-3 break-words">
            {service.description}
          </p>

          {/* Footer Decoration */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 text-white/20 text-[10px] font-bold uppercase tracking-widest overflow-hidden">
            <Sparkles size={14} className="text-brand-primary/50 shrink-0" />
            <span className="truncate">Elite Execution Standard</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
