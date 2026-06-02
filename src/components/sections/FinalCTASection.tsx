import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { Section } from '../ui/Section';
import { MagneticButton } from '../ui/MagneticButton';
import { VARIANTS, EASING } from '../../lib/motion-presets';
import { Link } from 'react-router-dom';

export const FinalCTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // 3D Perspective Scroll transformations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 22 });

  const rotateXSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [8, 0, 0, -8]);
  const translateYSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [40, 0, 0, -40]);
  const scaleSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [0.96, 1, 1, 0.96]);
  const opacitySection = useTransform(smoothScroll, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <Section 
      id="final-cta" 
      glowVariant="bottom" 
      className="relative py-24 md:py-32 border-t border-white/[0.08] bg-[#0A0A0B] overflow-hidden"
    >
      {/* Cybernetic Micro-Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-60 z-0" />
      
      {/* Projection Cyber Glow Source */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-brand-primary/5 rounded-full filter blur-[120px] pointer-events-none z-0 animate-pulse" />

      <div ref={sectionRef} className="w-full h-full relative z-10" style={{ perspective: 1200 }}>
        <motion.div 
          style={{ rotateX: rotateXSection, y: translateYSection, scale: scaleSection, opacity: opacitySection, transformStyle: "preserve-3d" }}
          className="flex flex-col items-center text-center max-w-5xl mx-auto px-6 relative z-10"
        >
          <div
            className="glass-card p-16 md:p-24 rounded-[32px] border border-white/[0.08] hover:border-brand-primary/30 w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.55)] bg-[#0D0D0E]/40 backdrop-blur-xl transition-all duration-500"
          >
            <div className="relative z-10 flex flex-col items-center space-y-8">
              
              {/* Status indicators */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.08] text-white/40 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,194,255,0.06)]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" /> 
                Secure Pipeline Operational
              </div>

              {/* Premium editorial headline */}
              <h2 className="text-4xl md:text-5.5xl font-black tracking-tight leading-[1.1] max-w-2xl mx-auto text-white">
                Initiate <span className="text-brand-primary font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.28)' }}>Ecosystem Discussions.</span>
              </h2>
              
              <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
                We collaborate with research institutions, deep-tech founders, and digital system operators to formulate next-generation infrastructure.
              </p>

              {/* Minimal button CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
                <MagneticButton strength={0.15}>
                  <Link 
                    to="/contact" 
                    className="px-10 py-5 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-black transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center gap-2.5 group"
                  >
                    Initiate Synchronisation <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </MagneticButton>

                <MagneticButton strength={0.15}>
                  <a 
                    href="mailto:hello.ayushishere@gmail.com" 
                    className="px-10 py-5 bg-white/[0.02] border border-white/[0.08] hover:bg-white/5 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-500 flex items-center gap-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.1)]"
                  >
                    <Mail size={14} className="text-white/40" /> Direct Protocol
                  </a>
                </MagneticButton>
              </div>

              {/* Bottom trust seal */}
              <div className="pt-8 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-brand-primary/50" /> End-to-End Encryption • Zero Clutter
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
