import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Mail, ArrowRight, Radio } from 'lucide-react';
import { Section } from '../ui/Section';
import { MagneticButton } from '../ui/MagneticButton';
import { Link } from 'react-router-dom';

export const ContactCTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // 3D Scroll Perspective transformation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 22 });

  const rotateXSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [4, 0, 0, -4]);
  const translateYSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [20, 0, 0, -20]);
  const scaleSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [0.98, 1, 1, 0.98]);
  const opacitySection = useTransform(smoothScroll, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <Section 
      id="contact" 
      glowVariant="bottom" 
      className="!py-16 md:!py-24 bg-[#0A0A0B] relative overflow-hidden"
    >
      {/* Cybernetic Micro-Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50 z-0" />
      
      {/* Projection Cyber Glow Source */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00C2FF]/3 rounded-full filter blur-[120px] pointer-events-none z-0 animate-pulse" />

      <div ref={sectionRef} className="w-full h-full relative z-10" style={{ perspective: 1200 }}>
        <motion.div 
          style={{ rotateX: rotateXSection, y: translateYSection, scale: scaleSection, opacity: opacitySection, transformStyle: "preserve-3d" }}
          className="flex flex-col items-center text-center max-w-5xl mx-auto px-4 sm:px-6 relative z-10"
        >
          
          {/* Active status pulse widget */}
          <div className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-white/[0.01] border border-white/[0.06] text-white/50 text-[9px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,194,255,0.08)] mb-8 font-mono shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span> 
            SYSTEM CORE CONNECTED • INTERFACE READY
          </div>

          {/* Large Premium Clamped Responsive Typography */}
          <h2 
            className="font-black text-white tracking-tight leading-[1.05] max-w-4xl mx-auto mb-8 select-none"
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(2.2rem, 6.2vw, 4.8rem)"
            }}
          >
            Initiate Direct <br className="sm:hidden" />
            <span className="text-[#00C2FF] font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.2)' }}>Protocol Loop.</span>
          </h2>

          <p className="text-white/40 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-12 font-semibold font-display leading-relaxed">
            Collaborate on startup systems engineering, microcontroller calibration streams, technical speaking, or rapid physical computing blueprints.
          </p>

          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16 w-full max-w-md px-4 sm:px-0">
            <MagneticButton strength={0.12} className="w-full sm:w-auto">
              <Link 
                to="/contact" 
                className="w-full sm:w-auto px-8 py-4.5 bg-white text-black hover:bg-[#00C2FF] rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-2xl flex items-center justify-center gap-2.5 group"
              >
                Sync Laboratory Node <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </MagneticButton>

            <MagneticButton strength={0.12} className="w-full sm:w-auto">
              <a 
                href="mailto:hello.ayushishere@gmail.com" 
                className="w-full sm:w-auto px-8 py-4.5 bg-white/[0.01] border border-white/[0.06] hover:bg-white/5 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg"
              >
                <Mail size={14} className="text-white/40" /> Direct Protocol
              </a>
            </MagneticButton>
          </div>

          {/* Cyber Trust/Encryption stamp */}
          <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 flex items-center gap-1.5 font-mono">
            <Radio size={12} className="text-[#00C2FF]/50 animate-pulse" /> 256-BIT SECURE KERNEL STAGE ACTIVE
          </div>

        </motion.div>
      </div>
    </Section>
  );
};
export default ContactCTASection;
