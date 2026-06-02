import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { VARIANTS } from '../../lib/motion-presets';
import { ShieldCheck, FileCode, CheckSquare, Sparkles, Search, LayoutGrid, Code2, Rocket } from 'lucide-react';

export const HomeMissionSection = () => {
  const steps = [
    {
      stepNumber: "01. Idea",
      title: "Define Strategy",
      desc: "Formulate a clear hypothesis and system architecture.",
      icon: Sparkles
    },
    {
      stepNumber: "02. Research",
      title: "SEO & Demand Check",
      desc: "Verify search volumes and target intent first.",
      icon: Search
    },
    {
      stepNumber: "03. Design",
      title: "Systems Mapping",
      desc: "Wireframe UX and map out data integrations.",
      icon: LayoutGrid
    },
    {
      stepNumber: "04. Build",
      title: "Implementation",
      desc: "Develop Next.js code and build automation workflows.",
      icon: Code2
    },
    {
      stepNumber: "05. Deploy",
      title: "Optimize & Launch",
      desc: "Configure sitemaps, tracking, and push to production.",
      icon: Rocket
    }
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Tested on Live Sites",
      desc: "Every workflow and checklist I share is tested in production first. No theoretical advice—only what works."
    },
    {
      icon: FileCode,
      title: "Exact Source Files",
      desc: "Get the actual code boilerplates, Cursor rule files, and Make.com templates I use to build systems."
    },
    {
      icon: CheckSquare,
      title: "Clear and Actionable",
      desc: "No fluff, no school-project fluff, and no enterprise talk. Just step-by-step frameworks ready to execute."
    }
  ];

  return (
    <Section id="mission" className="border-t border-white/5 bg-[#050505] relative overflow-hidden">
      {/* Styles for animated SVG line */}
      <style>{`
        @keyframes flow-horizontal {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
        .animate-flow-line {
          stroke-dasharray: 8 6;
          animation: flow-horizontal 1.2s linear infinite;
        }
      `}</style>

      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[400px] bg-brand-primary/2 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="ds-section-label"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Core Philosophy
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="ds-section-h2"
          >
            Why This Platform <span className="italic font-extrabold text-brand-primary">Exists.</span>
          </motion.h2>

          <motion.p
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl md:text-2xl text-white/70 leading-relaxed font-medium mb-8"
          >
            Most guides are too theoretical. Most templates are junk. 
            I document every workflow, test it on live sites, and share the exact files so you can build real products, automate operations, and scale.
          </motion.p>
        </div>

        {/* ----------------- MISSION FLOW VISUAL (ECOSYSTEM DIAGRAM) ----------------- */}
        <div className="mb-24 relative">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white/30 mb-8 select-none">
            The Systems Journey
          </h3>

          {/* Desktop connecting flow line (SVG) */}
          <div className="absolute top-[44px] left-[10%] right-[10%] h-[2px] pointer-events-none -z-10 hidden md:block">
            <svg className="w-full h-full" overflow="visible">
              <line
                x1="0%"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="rgba(0, 194, 255, 0.12)"
                strokeWidth="2"
              />
              <line
                x1="0%"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="#00C2FF"
                strokeWidth="2"
                className="animate-flow-line"
              />
            </svg>
          </div>

          {/* Mobile connecting flow line (SVG) */}
          <div className="absolute left-[44px] top-[44px] bottom-[44px] w-[2px] pointer-events-none -z-10 md:hidden">
            <svg className="w-full h-full" overflow="visible">
              <line
                x1="50%"
                y1="0%"
                x2="50%"
                y2="100%"
                stroke="rgba(0, 194, 255, 0.12)"
                strokeWidth="2"
              />
              <line
                x1="50%"
                y1="0%"
                x2="50%"
                y2="100%"
                stroke="#00C2FF"
                strokeWidth="2"
                className="animate-flow-line"
              />
            </svg>
          </div>

          {/* Workflow nodes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={idx}
                  variants={VARIANTS.fadeUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="relative group flex flex-row md:flex-col items-center md:items-center text-left md:text-center p-5 rounded-2xl bg-[#080808] border border-white/[0.04] hover:border-brand-primary/20 transition-all duration-300"
                >
                  {/* Circle Indicator with Icon */}
                  <div className="w-12 h-12 rounded-full bg-[#101010] border border-white/10 flex items-center justify-center text-white/50 group-hover:text-brand-primary group-hover:border-brand-primary/30 group-hover:shadow-[0_0_15px_rgba(0,194,255,0.15)] transition-all duration-300 shrink-0 relative z-10">
                    <StepIcon size={18} />
                  </div>
                  
                  {/* Text Content */}
                  <div className="ml-5 md:ml-0 md:mt-5 text-left md:text-center">
                    <span className="text-[9px] font-bold font-mono tracking-widest text-brand-primary uppercase block">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1 mb-2 tracking-tight group-hover:text-brand-primary transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium max-w-[170px] md:mx-auto">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-[#101010] border border-white/5 hover:border-brand-primary/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-6">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </Section>
  );
};

export default HomeMissionSection;
