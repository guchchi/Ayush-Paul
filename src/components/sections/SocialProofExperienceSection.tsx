import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import { Section } from '../ui/Section';
import { Trophy, Compass, Star } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

// ============================================================================
// HELPER: Telemetry Stat Ledger Card
// ============================================================================
const DiagnosticStat = ({ label, target, suffix }: { label: string, target: number, suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="bg-black/35 border border-white/[0.04] p-4 rounded-2xl flex flex-col justify-between font-mono h-24">
      <span className="text-[7px] text-white/20 uppercase font-bold tracking-widest leading-none">{label}</span>
      <span className="text-2xl sm:text-3xl font-black text-[#00C2FF] tracking-tight leading-none">
        {count}{suffix}
      </span>
    </div>
  );
};

export const SocialProofExperienceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Monochrome sliding logo ticker
  const logos = ["ESP32-S3", "Arduino C++", "Nvidia Jetson", "TensorFlow", "React.js", "Vite", "Firebase", "C++17", "Python", "Fusion 360", "Tailwind CSS", "OpenCV"];

  const timelineEvents = [
    {
      year: "2025",
      title: "Autonomous Vessel telemetry calibration",
      desc: "Programmed robust waypoint guidance filters on Atmega2560 control units. Handled dual-thruster steering loops over telemetry networks successfully.",
      icon: <Compass className="text-brand-primary" size={16} />
    },
    {
      year: "2024",
      title: "VibeCoder AI OTA Pipeline Assemblies",
      desc: "Designed and compiled local compiler streams generating edge microcontroller firmwares from prompt directives on NVIDIA Jetson architectures.",
      icon: <Star className="text-brand-primary" size={16} />
    },
    {
      year: "2023",
      title: "Parametric Mechanical Core Milling",
      desc: "Designed vibration isolation brackets in Fusion 360 and CNC-milled structural shields to house edge microcontrollers in high-vibration systems.",
      icon: <Trophy className="text-brand-primary" size={16} />
    }
  ];

  // 3D Scroll Perspective transformation
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
      id="experience" 
      glowVariant="bottom" 
      className="py-24 md:py-36 bg-[#070708] relative overflow-hidden"
    >
      {/* Cybernetic Micro-Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50 z-0" />
      
      {/* Projection Cyber Glow Source */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00C2FF]/3 rounded-full filter blur-[120px] pointer-events-none z-0 animate-pulse" />

      <div ref={sectionRef} className="w-full h-full relative z-10" style={{ perspective: 1200 }}>
        <motion.div 
          style={{ rotateX: rotateXSection, y: translateYSection, scale: scaleSection, opacity: opacitySection, transformStyle: "preserve-3d" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          
          {/* Header */}
          <div className="section-header max-w-3xl text-center mx-auto mb-24 flex flex-col items-center">
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="badge shadow-[0_0_20px_rgba(0,194,255,0.08)] bg-white/[0.01] border border-white/[0.06] text-[10px] font-bold uppercase tracking-widest text-[#00C2FF] flex items-center gap-1.5 px-4 py-2 rounded-full mb-6"
            >
              <Trophy size={14} className="text-[#00C2FF]" /> DEPLOYMENT LOGS
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6.5xl font-black tracking-tight text-white leading-[1.08]">
              Milestones & <span className="text-[#00C2FF] font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.2)' }}>Ledger.</span>
            </h2>
            <p className="text-white/40 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto mt-6">
              Track actual hardware builds, telemetry data sets, CAD files milling metrics, and C++ edge runtimes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
            
            {/* LEFT COLUMN: System Chronology Milestones Timeline (Spans 7 columns) */}
            <div className="lg:col-span-7">
              <div className="relative border-l border-white/[0.06] ml-4 sm:ml-24 space-y-10">
                {timelineEvents.map((evt, i) => (
                  <div key={i} className="relative pl-8 sm:pl-12 group">
                    
                    {/* Node Marker */}
                    <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-[#0A0A0B] border border-[#00C2FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,194,255,0.3)] z-10">
                      {evt.icon}
                    </div>

                    {/* Year Badge */}
                    <div className="absolute -left-16 sm:-left-24 top-1.5 text-[9px] font-mono font-bold text-[#00C2FF] bg-[#00C2FF]/5 border border-[#00C2FF]/20 px-2.5 py-1 rounded-lg shrink-0 text-center shadow-md">
                      {evt.year}
                    </div>

                    {/* Text card */}
                    <div className="bg-[#0D0D0E]/20 border border-white/[0.06] hover:border-[#00C2FF]/25 rounded-[24px] p-6 sm:p-8 shadow-lg transition-all duration-300">
                      <h4 className="text-lg font-bold text-white group-hover:text-[#00C2FF] transition-colors mb-2 leading-tight">
                        {evt.title}
                      </h4>
                      <p className="text-white/40 text-xs leading-relaxed font-semibold font-display">
                        {evt.desc}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Diagnostic Telemetry stats ledger (Spans 5 columns) */}
            <div className="lg:col-span-5 bg-[#0D0D0E]/20 border border-white/[0.06] rounded-[32px] p-6 sm:p-8 relative overflow-hidden">
              <div className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.2em] border-b border-white/[0.06] pb-3 mb-6">
                LABORATORY SPEC LEDGER
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DiagnosticStat label="CNC MECHANICAL HOURS" target={420} suffix=" hrs" />
                <DiagnosticStat label="DEPLOYED NODES CORE" target={50} suffix="+" />
                <DiagnosticStat label="R&D CODE Blueprints" target={20} suffix="+" />
                <DiagnosticStat label="SYSTEM RUNTIME LFT" target={99} suffix="%" />
              </div>

              {/* Extra telemetry parameters block */}
              <div className="mt-6 bg-black/40 border border-white/[0.04] p-5 rounded-2xl font-mono text-[9px] text-white/40 space-y-2">
                <div className="flex justify-between">
                  <span>LAST_SYNC_LATENCY:</span>
                  <span className="text-[#00C2FF]">0.42ms</span>
                </div>
                <div className="flex justify-between">
                  <span>FIRMWARE_OTA_STATUS:</span>
                  <span className="text-green-500">SYNCHRONIZED</span>
                </div>
                <div className="flex justify-between">
                  <span>ENCRYPTION_KERNEL:</span>
                  <span className="text-white/60">AES-256-GCM</span>
                </div>
              </div>
            </div>

          </div>

          {/* INFINITE Monochrome Logo Marquee */}
          <div className="relative overflow-hidden w-full pt-4">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#070708] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#070708] to-transparent z-20 pointer-events-none" />
            
            <div className="flex gap-8 whitespace-nowrap overflow-hidden select-none">
              <motion.div
                animate={{ x: [0, -1000] }}
                transition={{
                  repeat: Infinity,
                  duration: 25,
                  ease: "linear"
                }}
                className="flex gap-6 shrink-0"
              >
                {logos.concat(logos).map((logo, i) => (
                  <span 
                    key={i} 
                    className="text-white/15 hover:text-[#00C2FF] transition-colors text-[10px] font-mono font-bold tracking-widest bg-white/[0.01] border border-white/[0.04] py-3.5 px-6 rounded-full"
                  >
                    {logo}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

        </motion.div>
      </div>
    </Section>
  );
};
export default SocialProofExperienceSection;
