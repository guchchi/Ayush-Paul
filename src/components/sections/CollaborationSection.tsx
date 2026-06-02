import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Rocket, Star, Layers, Cpu, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Section } from '../ui/Section';
import { MagneticButton } from '../ui/MagneticButton';
import { Link } from 'react-router-dom';
import { VARIANTS } from '../../lib/motion-presets';

export const CollaborationSection = () => {
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
      id="collaboration" 
      glowVariant="side" 
      className="!py-16 md:!py-24 bg-[#070708] relative overflow-hidden"
    >
      {/* Cybernetic Micro-Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50 z-0" />
      
      {/* Projection Cyber Glow Source */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-[#00C2FF]/3 rounded-full filter blur-[120px] pointer-events-none z-0 animate-pulse" />

      <div ref={sectionRef} className="w-full h-full relative z-10" style={{ perspective: 1200 }}>
        <motion.div 
          style={{ rotateX: rotateXSection, y: translateYSection, scale: scaleSection, opacity: opacitySection, transformStyle: "preserve-3d" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* LEFT COLUMN: Sticky Editorial Manifesto (Spans 5 columns) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8 text-left">
              <motion.div
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="badge shadow-[0_0_20px_rgba(0,194,255,0.08)] bg-white/[0.01] border border-white/[0.06] text-[10px] font-bold uppercase tracking-widest text-[#00C2FF] flex items-center gap-1.5 px-4 py-2 rounded-full w-fit mb-4"
              >
                <CheckCircle size={14} className="text-[#00C2FF]" /> ACTIVE SYNC PROTOCOLS
              </motion.div>
              
              <h3 className="text-3xl sm:text-4xl lg:text-5.5xl font-black text-white tracking-tight leading-[1.1]">
                Injecting logic <br />
                into physical <br />
                <span className="text-[#00C2FF] font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.2)' }}>scales.</span>
              </h3>
              
              <p className="text-white/45 text-sm sm:text-base leading-relaxed font-semibold font-display max-w-md">
                We form direct collaboration loops with young deep-tech ventures, PCM builders, and industrial laboratories to assemble and calibrate physical edge-AI hardware blueprints.
              </p>

              <div className="pt-4">
                <MagneticButton strength={0.15}>
                  <Link 
                    to="/contact" 
                    className="px-8 py-4 bg-white text-black hover:bg-[#00C2FF] rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-2xl flex items-center gap-2.5 w-fit group"
                  >
                    Sync with the Lab <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </MagneticButton>
              </div>
            </div>

            {/* RIGHT COLUMN: Asymmetric Pile of 3 Unique Bento Showcases (Spans 7 columns) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Card 1: Startups & Enterprise Architectures */}
              <div className="group relative bg-[#0D0D0E]/20 border border-white/[0.06] hover:border-[#00C2FF]/30 rounded-[32px] overflow-hidden p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[260px] cursor-pointer">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.01] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#00C2FF]/10 transition-all duration-500">
                    <Rocket size={22} className="text-[#00C2FF]" />
                  </div>
                  <span className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] mt-1 shrink-0">
                    STARTUP ARCHITECTURE
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-bold tracking-tight text-white mb-2 group-hover:text-[#00C2FF] transition-colors leading-snug">
                    Venture Telemetry & Database Audits
                  </h4>
                  <p className="text-white/40 text-xs leading-relaxed font-semibold font-display">
                    Audit digital backend infrastructures, coordinate high-throughput edge telemetry pipelines, and structure resilient data clusters for early-stage deep-tech ventures.
                  </p>
                </div>

                <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between mt-auto">
                  <Link 
                    to="/contact?intent=startups"
                    className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-widest text-[#00C2FF] group-hover:text-white transition-colors"
                  >
                    <span>Request System Audit</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Research Labs & Blueprints */}
              <div className="group relative bg-[#0D0D0E]/20 border border-white/[0.06] hover:border-[#00C2FF]/30 rounded-[32px] overflow-hidden p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[260px] cursor-pointer">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.01] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#00C2FF]/10 transition-all duration-500">
                    <Layers size={22} className="text-[#00C2FF]" />
                  </div>
                  <span className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] mt-1 shrink-0">
                    LAB INTEGRATIONS
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-bold tracking-tight text-white mb-2 group-hover:text-[#00C2FF] transition-colors leading-snug">
                    Co-Design & Hardware Blueprinting
                  </h4>
                  <p className="text-white/40 text-xs leading-relaxed font-semibold font-display">
                    Formulate parametric mechanical CAD outlines, co-develop multi-sensor microcontroller housings, and coordinate telemetry streams for active research lab partners.
                  </p>
                </div>

                <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between mt-auto">
                  <Link 
                    to="/contact?intent=partnerships"
                    className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-widest text-[#00C2FF] group-hover:text-white transition-colors"
                  >
                    <span>Connect Laboratory</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Academic Mentorship & Keynotes */}
              <div className="group relative bg-[#0D0D0E]/20 border border-white/[0.06] hover:border-[#00C2FF]/30 rounded-[32px] overflow-hidden p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[260px] cursor-pointer">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.01] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#00C2FF]/10 transition-all duration-500">
                    <Star size={22} className="text-[#00C2FF]" />
                  </div>
                  <span className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] mt-1 shrink-0">
                    DEVELOPER AUDITS
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-bold tracking-tight text-white mb-2 group-hover:text-[#00C2FF] transition-colors leading-snug">
                    Technical Reviews & Mentoring
                  </h4>
                  <p className="text-white/40 text-xs leading-relaxed font-semibold font-display">
                    Provide detailed software test reports, run firmware loop code audits, and guide ambitious student builders in robotics calibration and telemetry protocols.
                  </p>
                </div>

                <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between mt-auto">
                  <Link 
                    to="/contact?intent=mentorship"
                    className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-widest text-[#00C2FF] group-hover:text-white transition-colors"
                  >
                    <span>Interlock Protocols</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </Section>
  );
};
export default CollaborationSection;
