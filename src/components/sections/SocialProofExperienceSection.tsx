import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import { Section } from '../ui/Section';
import { Trophy, Compass, Star, Activity, RefreshCw, ShieldCheck, Medal, Award } from 'lucide-react';
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

  const rotateXSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [4, 0, 0, -4]);
  const translateYSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [20, 0, 0, -20]);
  const scaleSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [0.98, 1, 1, 0.98]);
  const opacitySection = useTransform(smoothScroll, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <Section 
      id="experience" 
      glowVariant="bottom" 
      className="!py-16 md:!py-24 bg-[#070708] relative overflow-hidden"
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
          <div className="section-header max-w-3xl text-center mx-auto mb-12 flex flex-col items-center">
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="badge shadow-[0_0_20px_rgba(0,194,255,0.08)] bg-white/[0.01] border border-white/[0.06] text-[10px] font-bold uppercase tracking-widest text-[#00C2FF] flex items-center gap-1.5 px-4 py-2 rounded-full mb-6"
            >
              <Trophy size={14} className="text-[#00C2FF]" /> Recognition & Milestones
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6.5xl font-black tracking-tight text-white leading-[1.08]">
              Milestones & <span className="text-[#00C2FF] font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.2)' }}>Ledger.</span>
            </h2>
            <p className="text-white/40 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto mt-6">
              A track record of real builds, recognized work, and shipped systems.
            </p>
          </div>

          {/* === AWARDS ROW === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {/* Award 1: INSPIRE MANAK */}
            <div className="relative flex items-start gap-4 p-5 rounded-[24px] bg-amber-500/[0.04] border border-amber-500/20 overflow-hidden group hover:border-amber-400/35 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Medal size={20} className="text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-400/70 mb-1">National Recognition</span>
                <h4 className="text-sm font-bold text-white leading-tight">INSPIRE Award — MANAK</h4>
                <p className="text-[11px] text-white/40 font-medium mt-1 leading-relaxed">Selected by the Dept. of Science & Technology, Govt. of India for innovative student research.</p>
              </div>
            </div>

            {/* Award 2: H2R Robot */}
            <div className="relative flex items-start gap-4 p-5 rounded-[24px] bg-brand-primary/[0.03] border border-brand-primary/15 overflow-hidden group hover:border-brand-primary/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent" />
              <div className="w-11 h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                <Award size={20} className="text-brand-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-brand-primary/70 mb-1">Flagship Prototype</span>
                <h4 className="text-sm font-bold text-white leading-tight">H2R Humanoid Robot</h4>
                <p className="text-[11px] text-white/40 font-medium mt-1 leading-relaxed">Custom-built bipedal robotics platform featuring servo-driven articulation and autonomous balance control.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
            
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
                System Diagnostics Ledger
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DiagnosticStat label="CAD R&D Hours" target={420} suffix=" hrs" />
                <DiagnosticStat label="Active Blueprints" target={50} suffix="+" />
                <DiagnosticStat label="Systems Deployed" target={20} suffix="+" />
                <DiagnosticStat label="Average Uptime" target={99} suffix="%" />
              </div>

              {/* Extra telemetry parameters block with visual icons for scanning */}
              <div className="mt-6 bg-black/40 border border-white/[0.04] p-5 rounded-2xl font-mono text-[10px] text-white/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><Activity size={12} className="text-[#00C2FF]" /> Sync Latency:</span>
                  <span className="text-[#00C2FF] font-bold">0.42ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><RefreshCw size={12} className="text-green-500 animate-spin" style={{ animationDuration: '6s' }} /> Compile Status:</span>
                  <span className="text-green-500 font-bold">SYNCHRONIZED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><ShieldCheck size={12} className="text-white/60" /> Security Standard:</span>
                  <span className="text-white/70 font-bold">AES-256-GCM</span>
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
