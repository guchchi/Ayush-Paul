import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Section } from '../ui/Section';
import { Eye, Key, Cpu, ShieldCheck } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

export const EcosystemFlowSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Inspect',
      subtitle: 'Analyze architecture blueprints',
      description: 'Review interactive CAD mechanical schematics, component list sheets, offline firmware parameters, and communication protocol diagrams prior to mounting.',
      icon: <Eye className="text-brand-primary" size={24} />
    },
    {
      step: '02',
      title: 'Access',
      subtitle: 'Unlock engineering files',
      description: 'Acquire direct access to secure operational downloads including compiled microcontroller firmware binaries, 3D STEP assets, and agentic compiler prompt sets.',
      icon: <Key className="text-brand-primary animate-pulse" size={24} />
    },
    {
      step: '03',
      title: 'Deploy',
      subtitle: 'Synchronize edge runtimes',
      description: 'Sync modular software packages straight into active server runtimes, robotic microcontrollers, offline LLM setups, or secure hardware environments.',
      icon: <Cpu className="text-brand-primary" size={24} />
    }
  ];

  // 3D Perspective Scroll Container Reference
  const sectionRef = useRef<HTMLDivElement>(null);

  // 3D Scroll Perspective transformation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 22 });

  const rotateXSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [8, 0, 0, -8]);
  const translateYSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [50, 0, 0, -50]);
  const scaleSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [0.96, 1, 1, 0.96]);
  const opacitySection = useTransform(smoothScroll, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Offset parallax translations for dynamic cascade
  const col1Y = useTransform(smoothScroll, [0, 1], [25, -25]);
  const col2Y = useTransform(smoothScroll, [0, 1], [0, 0]);
  const col3Y = useTransform(smoothScroll, [0, 1], [-25, 25]);

  return (
    <Section 
      id="ecosystem-flow" 
      glowVariant="center" 
      className="py-24 md:py-32 border-t border-white/[0.08] bg-[#070708] relative overflow-hidden"
    >
      {/* Cybernetic Micro-Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-60 z-0" />

      {/* Dynamic Projected Cyber Light Source */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-primary/5 rounded-full filter blur-[120px] pointer-events-none z-0 animate-pulse" />

      <div ref={sectionRef} className="w-full h-full relative z-10" style={{ perspective: 1200 }}>
        <motion.div 
          style={{ rotateX: rotateXSection, y: translateYSection, scale: scaleSection, opacity: opacitySection, transformStyle: "preserve-3d" }}
          className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        >
          
          {/* Section Header */}
          <div className="section-header max-w-3xl text-center mx-auto mb-20 flex flex-col items-center">
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="badge shadow-[0_0_20px_rgba(0,194,255,0.08)] bg-white/[0.02] border border-white/[0.08] text-[10px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-1.5 px-4 py-2 rounded-full"
            >
              <ShieldCheck size={14} className="text-brand-primary" /> Lifecycle Protocol
            </motion.div>
            <motion.h2 
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-4xl md:text-5.5xl font-black tracking-tight text-white mt-6 leading-[1.1]"
            >
              How the Ecosystem <span className="text-brand-primary font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.28)' }}>Works.</span>
            </motion.h2>
            <motion.p 
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-white/40 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto mt-6"
            >
              A high-efficiency, three-stage lifecycle built to inspect structures, access telemetry compilations, and deploy systems.
            </motion.p>
          </div>

          {/* 3-Step Flow Grid */}
          <div className="grid md:grid-cols-3 gap-8 relative z-10" style={{ transformStyle: "preserve-3d" }}>
            {steps.map((item, idx) => {
              const colY = idx === 0 ? col1Y : idx === 1 ? col2Y : col3Y;
              return (
                <motion.div
                  key={idx}
                  style={{ y: colY }}
                  variants={VARIANTS.fadeUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10, scale: 1.01 }}
                  className="group bg-[#0D0D0E]/30 backdrop-blur-xl border border-white/[0.08] hover:border-brand-primary/30 rounded-[32px] p-8 flex flex-col justify-between min-h-[340px] shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-all duration-500 relative"
                >
                  {/* Subtle inner radial gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] pointer-events-none" />

                  {/* Card Header Panel */}
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-[16px] bg-white/[0.02] border border-white/[0.08] flex items-center justify-center group-hover:bg-brand-primary/5 group-hover:border-brand-primary/30 transition-all duration-500">
                      {item.icon}
                    </div>
                    <span className="font-mono text-3xl font-extrabold text-white/5 tracking-tighter group-hover:text-brand-primary/10 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="mt-8 flex-1 flex flex-col justify-end">
                    <div className="text-[10px] font-mono text-brand-primary uppercase tracking-[0.25em] font-bold mb-1.5">{item.subtitle}</div>
                    <h3 className="text-2xl font-bold tracking-tight text-white mb-4">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed font-medium font-display">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </motion.div>
      </div>
    </Section>
  );
};
export default EcosystemFlowSection;
