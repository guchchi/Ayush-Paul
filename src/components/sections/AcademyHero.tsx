import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowDown, Bot, Globe, Search, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MagneticButton } from '../ui/MagneticButton';

interface AcademyHeroProps {
  onExploreClick: () => void;
  onProgramsClick: () => void;
}

const roadmapNodes = [
  {
    step: '01',
    icon: Bot,
    label: 'AI Integration',
    subtitle: 'Research & Content Systems',
    color: '#6b35ff',
    bg: '#f3efff',
    border: '#ebe5ff',
    delay: 0,
  },
  {
    step: '02',
    icon: Globe,
    label: 'Web Development',
    subtitle: 'SaaS & Brands Building',
    color: '#0058be',
    bg: '#eff4ff',
    border: '#dce9ff',
    delay: 0.1,
  },
  {
    step: '03',
    icon: Search,
    label: 'Organic SEO',
    subtitle: 'Crawls & Authority Building',
    color: '#ff8000',
    bg: '#fff4eb',
    border: '#ffe9d6',
    delay: 0.2,
  },
  {
    step: '04',
    icon: Zap,
    label: 'Automation Scale',
    subtitle: 'Eliminate Repetitive Work',
    color: '#558b2f',
    bg: '#f0fbe8',
    border: '#e1f7d2',
    delay: 0.3,
  },
];

export const AcademyHero = ({ onExploreClick, onProgramsClick }: AcademyHeroProps) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 px-6 overflow-hidden">
      {/* Background Soft Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,88,190,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(0,88,190,0.012)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT: Typography + CTAs (col-span-6) ── */}
          <div className="flex flex-col lg:col-span-6 text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#0058be] shadow-sm mb-8 mx-auto lg:mx-0"
            >
              <span className="w-1.5 h-1.5 bg-[#0058be] rounded-full animate-pulse" />
              <span className="tracking-[0.22em]">Academy</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[1.05] text-[#0b1c30] mb-8"
            >
              Learn The Skills <br />
              <span className="text-[#0058be]">Behind Systems</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-[#424754] font-medium max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              Master AI, websites, SEO, automation, and digital product development through structured learning paths designed for builders and creators.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-12"
            >
              <MagneticButton>
                <button
                  onClick={onExploreClick}
                  className="px-8 py-4 bg-[#0b1c30] text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 group hover:scale-105 transition-transform w-full sm:w-auto shadow-sm"
                >
                  Explore Learning Paths
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </MagneticButton>

              <MagneticButton>
                <button
                  onClick={onProgramsClick}
                  className="px-8 py-4 bg-white border border-[#c2c6d6]/30 text-[#0b1c30] rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
                >
                  View Programs
                  <ArrowDown size={14} className="text-[#0058be]" />
                </button>
              </MagneticButton>
            </motion.div>

            {/* Stats / Trust Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-[#c2c6d6]/20"
            >
              <div className="flex flex-col text-left">
                <span className="text-2xl font-extrabold text-[#0b1c30] tracking-tight leading-none mb-1">
                  100%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">
                  Project Based
                </span>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-2xl font-extrabold text-[#0b1c30] tracking-tight leading-none mb-1">
                  4
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">
                  Core Modules
                </span>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-2xl font-extrabold text-[#0058be] tracking-tight leading-none mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={18} className="text-[#0058be]" />
                  Active
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">
                  Enrollment
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Visual Learning Roadmap (col-span-6) ── */}
          <div className="lg:col-span-6 relative flex flex-col items-center w-full">
            {/* Radial background glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="w-96 h-96 bg-[#0058be]/5 rounded-full filter blur-[100px]" />
            </div>

            {/* Timeline container */}
            <div className="relative w-full max-w-[480px] flex flex-col gap-6 p-4">
              
              {/* Animated SVG Path for Connecting line */}
              <div className="absolute left-[39px] top-10 bottom-10 w-1 pointer-events-none hidden sm:block">
                <svg className="w-full h-full" fill="none">
                  <line
                    x1="2" y1="0" x2="2" y2="100%"
                    stroke="#c2c6d6"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    opacity="0.3"
                  />
                  <motion.line
                    x1="2" y1="0" x2="2" y2="100%"
                    stroke="#0058be"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -20 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                </svg>
              </div>

              {roadmapNodes.map((node, idx) => {
                const Icon = node.icon;
                return (
                  <motion.div
                    key={node.label}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55, delay: 0.1 + node.delay, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.02, x: 6 }}
                    className={cn(
                      "flex items-center gap-4 sm:gap-6 bg-white border border-[#c2c6d6]/30 rounded-[24px] p-5 sm:p-6 shadow-sm w-full relative group transition-all duration-300",
                      "hover:border-[var(--node-border)] hover:shadow-ambient"
                    )}
                    style={{ '--node-border': node.border } as React.CSSProperties}
                  >
                    {/* Node Index/Step */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border font-bold text-sm"
                      style={{ 
                        backgroundColor: node.bg, 
                        color: node.color,
                        borderColor: node.border
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Node content */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-bg-secondary text-[#424754]">
                          Step {node.step}
                        </span>
                        <h3 className="text-sm font-extrabold text-[#0b1c30] tracking-tight">
                          {node.label}
                        </h3>
                      </div>
                      <p className="text-xs text-[#424754] font-medium truncate">
                        {node.subtitle}
                      </p>
                    </div>

                    {/* Step label right badge */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-bg-secondary border border-[#c2c6d6]/20">
                      <ArrowRight size={12} className="text-[#0058be] rotate-45" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
