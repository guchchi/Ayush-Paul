import React from 'react';
import { motion } from 'motion/react';
import { Bot, Globe, Search, Zap, ArrowUpRight } from 'lucide-react';

interface AcademyPathsProps {
  onPathSelect: (pathId: string) => void;
}

const pathways = [
  {
    id: 'ai',
    title: 'AI Workflows',
    icon: Bot,
    description: 'Learn how to use AI for research, content systems, prompt engineering, and intelligent execution frameworks.',
    cta: 'Explore AI Pathway',
    accent: '#f3efff',
    iconBg: '#f3efff',
    iconColor: '#6b35ff',
    border: '#ebe5ff',
  },
  {
    id: 'websites',
    title: 'Web Engineering',
    icon: Globe,
    description: 'Build modern websites, personal portfolios, SaaS boilerplates, and custom digital products.',
    cta: 'Explore Web Pathway',
    accent: '#eff4ff',
    iconBg: '#eff4ff',
    iconColor: '#0058be',
    border: '#dce9ff',
  },
  {
    id: 'seo',
    title: 'Growth & SEO',
    icon: Search,
    description: 'Understand crawl mechanics, schemas, authority growth systems, and sustainable organic discoverability.',
    cta: 'Explore SEO Pathway',
    accent: '#fff4eb',
    iconBg: '#fff4eb',
    iconColor: '#ff8000',
    border: '#ffe9d6',
  },
  {
    id: 'automation',
    title: 'Automation Systems',
    icon: Zap,
    description: 'Create zero-maintenance pipelines, integrate APIs, and build scalable scenarios to eliminate manual tasks.',
    cta: 'Explore Automation Pathway',
    accent: '#f0fbe8',
    iconBg: '#f0fbe8',
    iconColor: '#558b2f',
    border: '#e1f7d2',
  },
];

export const AcademyPaths = ({ onPathSelect }: AcademyPathsProps) => {
  return (
    <section
      className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-24 border-t border-[#c2c6d6]/20"
      id="academy-paths-section"
    >
      {/* Header */}
      <div className="max-w-3xl mb-14 text-left">
        {/* Small label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
        >
          <span className="w-1.5 h-1.5 bg-[#0058be] rounded-full" />
          <span className="tracking-[0.22em]">Pathways</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] mb-6 text-[#0b1c30]"
        >
          Choose Your<br />
          Learning Path
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base md:text-lg font-medium leading-relaxed max-w-2xl"
        >
          Start where you are and progress through structured pathways built around real-world implementation.
        </motion.p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pathways.map((path, i) => {
          const Icon = path.icon;
          return (
            <motion.button
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: 0.12 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -6,
                scale: 1.015,
                borderColor: path.border,
              }}
              onClick={() => onPathSelect(path.id)}
              className="group bg-white border border-[#c2c6d6]/30 shadow-sm rounded-[32px] p-8 flex flex-col items-start text-left transition-all duration-300 w-full h-full hover:shadow-ambient cursor-pointer"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-[1.03] shadow-sm border border-[#c2c6d6]/10"
                style={{
                  backgroundColor: path.iconBg,
                }}
              >
                <Icon size={20} style={{ color: path.iconColor }} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-extrabold tracking-tight mb-3 text-[#0b1c30]">
                {path.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-[#424754] font-semibold leading-relaxed flex-1 mb-8">
                {path.description}
              </p>

              {/* CTA */}
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#424754]/60 group-hover:text-[#0058be] transition-colors duration-300">
                {path.cta}
                <span className="w-6 h-6 rounded-full bg-bg-secondary border border-[#c2c6d6]/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[#0058be] group-hover:border-[#0058be] group-hover:text-white">
                  <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
