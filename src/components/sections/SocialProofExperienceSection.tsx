import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useInView } from 'motion/react';
import { Section } from '../ui/Section';
import { Trophy, Compass, Star, Medal, Award, Binary, BookOpen, Layers, Lock } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

// ============================================================================
// REDESIGNED COMPONENTS: Spotlight Card with screenshot design structure
// ============================================================================
const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(0,194,255,0.04)" }: { children: React.ReactNode, className?: string, spotlightColor?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`relative rounded-2xl bg-[#09090A] border border-white/[0.03] hover:border-white/[0.07] hover:scale-[1.01] active:scale-[0.995] cursor-pointer overflow-hidden p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
    >
      {/* Custom graph-paper background backdrop matching visual style */}
      <div 
        className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Spotlight overlay effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-2xl z-0"
        style={{
          opacity: isFocused ? 1 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 60%)`
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT REDESIGN: Stats Matrix and Scroll Timeline
// ============================================================================
export const ProofOfExecutionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const logos = ["ESP32-S3", "Arduino C++", "Nvidia Jetson", "TensorFlow", "React.js", "Vite", "Firebase", "C++17", "Python", "Fusion 360", "Tailwind CSS", "OpenCV"];

  const timelineEvents = [
    {
      year: "2025",
      title: "Autonomous Vessel Telemetry Calibration",
      desc: "Programmed robust Kalman filters and PID feedback loops on dual-thruster Arduino steering controllers. Synced real-time sensory navigation telemetry across custom Edge systems.",
      icon: <Compass className="text-[#00C2FF]" size={14} />,
      color: "#00C2FF"
    },
    {
      year: "2024",
      title: "VibeCoder AI Edge Compilation Pipelines",
      desc: "Architected a custom prompt-to-C++ firmwares compilation engine on local NVIDIA Jetson nodes, enabling autonomous micro-runtimes deployment over cellular networks.",
      icon: <Star className="text-[#7B61FF]" size={14} />,
      color: "#7B61FF"
    },
    {
      year: "2023",
      title: "Parametric Mechanical Core Milling",
      desc: "Engineered high-vibration isolation mounting shields using Fusion 360 CAD. CNC-milled physical protective aluminum housings for structural telemetry modules.",
      icon: <Trophy className="text-[#00FF66]" size={14} />,
      color: "#00FF66"
    }
  ];

  // Dynamic Scroll & Perspective transformations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 60, damping: 24 });

  const rotateXSection = useTransform(smoothScroll, [0, 0.4, 0.6, 1], [3, 0, 0, -3]);
  const scaleSection = useTransform(smoothScroll, [0, 0.4, 0.6, 1], [0.99, 1, 1, 0.99]);
  const opacitySection = useTransform(smoothScroll, [0, 0.08, 0.92, 1], [0.4, 1, 1, 0.4]);

  // Scroll linked SVG progress line calculations
  const timelineProgress = useTransform(smoothScroll, [0.1, 0.75], [0, 1]);
  const timelineHeightSpring = useSpring(timelineProgress, { stiffness: 80, damping: 20 });

  return (
    <Section
      id="proof-of-execution"
      glowVariant="bottom"
      className="py-24 md:py-32 bg-[#070708] relative overflow-hidden"
    >
      {/* Digital Micro-Grid Background Layer */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20 z-0" />
      
      {/* Background radial spotlight source */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] bg-[#00C2FF]/3 rounded-full filter blur-[140px] pointer-events-none z-0" />

      <div ref={containerRef} className="w-full h-full relative z-10" style={{ perspective: 1200 }}>
        <motion.div
          style={{
            rotateX: rotateXSection,
            scale: scaleSection,
            opacity: opacitySection,
            transformStyle: "preserve-3d"
          }}
          className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        >
          
          {/* ASYMMETRIC STATS GRID: Copy of provided design structure */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            
            {/* Left Column: Huge, bold heading with split contrast colors */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#00C2FF] font-semibold uppercase block">
                // 02: AUTHORITY
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6.5xl font-black tracking-tight text-white uppercase leading-[1.04] max-w-lg">
                BUILDING <br />
                THE FUTURE, <br />
                <span className="text-white/40">ONE SYSTEM <br />AT A TIME.</span>
              </h2>
            </div>

            {/* Right Column: 2x2 stats block divided by clean glowing lines */}
            <div className="lg:col-span-6 grid grid-cols-2 border border-white/[0.04] bg-[#09090A]/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
              
              {/* Stat Cell 1 */}
              <div className="p-8 border-r border-b border-white/[0.04] flex flex-col justify-center space-y-2 hover:bg-white/[0.005] transition-colors group">
                <span 
                  className="text-4xl sm:text-5xl font-black tracking-tight transition-all duration-300"
                  style={{ color: "#00C2FF", textShadow: "0 0 16px rgba(0, 194, 255, 0.15)" }}
                >
                  420h
                </span>
                <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase font-black">
                  CAD_RD_HOURS
                </span>
              </div>

              {/* Stat Cell 2 */}
              <div className="p-8 border-b border-white/[0.04] flex flex-col justify-center space-y-2 hover:bg-white/[0.005] transition-colors group">
                <span 
                  className="text-4xl sm:text-5xl font-black tracking-tight transition-all duration-300"
                  style={{ color: "#7B61FF", textShadow: "0 0 16px rgba(123, 97, 255, 0.15)" }}
                >
                  50+
                </span>
                <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase font-black">
                  ACTIVE_BLUEPRINTS
                </span>
              </div>

              {/* Stat Cell 3 */}
              <div className="p-8 border-r border-white/[0.04] flex flex-col justify-center space-y-2 hover:bg-white/[0.005] transition-colors group">
                <span 
                  className="text-4xl sm:text-5xl font-black tracking-tight transition-all duration-300"
                  style={{ color: "#00FF66", textShadow: "0 0 16px rgba(0, 255, 102, 0.15)" }}
                >
                  20+
                </span>
                <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase font-black">
                  SYSTEMS_DEPLOYED
                </span>
              </div>

              {/* Stat Cell 4 */}
              <div className="p-8 flex flex-col justify-center space-y-2 hover:bg-white/[0.005] transition-colors group">
                <span 
                  className="text-4xl sm:text-5xl font-black tracking-tight transition-all duration-300"
                  style={{ color: "#FF9900", textShadow: "0 0 16px rgba(255, 153, 0, 0.15)" }}
                >
                  99%
                </span>
                <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase font-black">
                  AVERAGE_UPTIME
                </span>
              </div>

            </div>

          </div>

          {/* === AWARDS & CREDENTIALS ROW === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
            
            {/* Award 1: INSPIRE MANAK */}
            <SpotlightCard spotlightColor="rgba(245,158,11,0.02)">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-center shrink-0 shadow-inner">
                  <Medal size={20} className="text-amber-400" />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-500/60">NATIONAL GOVERNMENT BLUEPRINT</span>
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight leading-snug">DST INSPIRE Award — MANAK</h4>
                  <p className="text-xs text-white/40 font-medium leading-relaxed">
                    Funded and selected by the Department of Science & Technology, Government of India, for outstanding physical and cybernetic systems research.
                  </p>
                </div>
              </div>
            </SpotlightCard>

            {/* Award 2: H2R Robot */}
            <SpotlightCard spotlightColor="rgba(0,194,255,0.02)">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-[#00C2FF]/5 border border-[#00C2FF]/15 flex items-center justify-center shrink-0 shadow-inner">
                  <Award size={20} className="text-[#00C2FF]" />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C2FF]" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#00C2FF]/60">FLAGSHIP ROBOTICS PILOT</span>
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight leading-snug">H2R Humanoid Robot v1.0</h4>
                  <p className="text-xs text-white/40 font-medium leading-relaxed">
                    Fully articulated bipedal chassis custom-designed in CAD, utilizing high-torque responsive servo arrays and real-time gyroscopic balance filters.
                  </p>
                </div>
              </div>
            </SpotlightCard>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-20">
            
            {/* LEFT COLUMN: Scroll-Linked Chronological Ledger (Spans 7 columns) */}
            <div className="lg:col-span-7 relative">
              
              {/* Dynamic scroll progress SVG connector */}
              <div className="absolute left-4 sm:left-24 top-4 bottom-4 w-[2px] bg-white/[0.03] z-0">
                <motion.div
                  style={{ scaleY: timelineHeightSpring, transformOrigin: "top" }}
                  className="w-full h-full bg-gradient-to-b from-[#00C2FF] via-[#7B61FF] to-[#00FF66] shadow-[0_0_12px_rgba(0,194,255,0.4)]"
                />
              </div>

              <div className="space-y-12">
                {timelineEvents.map((evt, i) => (
                  <div key={i} className="relative pl-12 sm:pl-36 group select-none">
                    
                    {/* Floating year label */}
                    <div className="absolute -left-0 sm:left-6 top-2 text-[10px] font-mono font-black text-white/20 bg-white/[0.015] border border-white/[0.04] px-3 py-1.5 rounded-xl z-20 transition-all duration-300 group-hover:text-white/60 group-hover:border-white/[0.08]">
                      {evt.year}
                    </div>

                    {/* Timeline Node Point */}
                    <div
                      className="absolute left-[13px] sm:left-[93px] top-4 w-2.5 h-2.5 rounded-full bg-black border-[1.5px] transition-all duration-500 z-10"
                      style={{ borderColor: evt.color, boxShadow: `0 0 10px ${evt.color}40` }}
                    />

                    {/* Milestone Card */}
                    <div className="bg-[#0D0D0E]/20 border border-white/[0.04] hover:bg-white/[0.02] hover:border-white/[0.08] rounded-xl p-6 sm:p-8 shadow-lg transition-all duration-500">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                          {evt.icon}
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-white transition-colors duration-300">
                          {evt.title}
                        </h4>
                      </div>
                      <p className="text-white/40 text-xs leading-relaxed font-semibold font-sans pt-1">
                        {evt.desc}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Secondary Diagnostics ledger stats (Spans 5 columns) */}
            <div className="lg:col-span-5 bg-[#0D0D0E]/20 border border-white/[0.04] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between shadow-xl">
              {/* Shimmer top accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00C2FF]/20 to-transparent pointer-events-none" />
              
              <div>
                <div className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] border-b border-white/[0.06] pb-4 mb-6 flex justify-between items-center">
                  <span>METRICS SYSTEM DIAGNOSTICS</span>
                  <span className="text-[8px] text-[#00C2FF] font-semibold bg-[#00C2FF]/5 px-2 py-0.5 border border-[#00C2FF]/20 rounded">SYNCED</span>
                </div>

                <p className="text-xs text-white/40 leading-relaxed font-medium mb-8">
                  Core execution telemetry across the cyber-physical cluster. All nodes operate autonomously on local firmwares.
                </p>
              </div>

              {/* Extra telemetry parameters block with visual icons for scanning */}
              <div className="bg-black/30 border border-white/[0.04] p-5 rounded-xl font-mono text-[9.5px] text-white/40 space-y-4 shadow-inner">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.02] last:border-0">
                  <span className="flex items-center gap-2 text-white/20"><Binary size={12} className="text-[#00C2FF]" /> Compiled Firmware</span>
                  <span className="text-[#00C2FF] font-bold">142,400 LOC</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.02] last:border-0">
                  <span className="flex items-center gap-2 text-white/20"><BookOpen size={12} className="text-purple-400" /> Research Whitepapers</span>
                  <span className="text-purple-400 font-bold">02 active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-white/20"><Layers size={12} className="text-green-500" /> Edge Cluster Nodes</span>
                  <span className="text-green-500 font-bold">4 functional</span>
                </div>
              </div>
            </div>

          </div>

          {/* INFINITE Tech Stack Marquee with Blurred Edges */}
          <div className="relative overflow-hidden w-full pt-6">
            <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#070708] via-[#070708]/60 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#070708] via-[#070708]/60 to-transparent z-20 pointer-events-none" />
            
            <div className="flex gap-8 whitespace-nowrap overflow-hidden select-none">
              <motion.div
                animate={{ x: [0, -1000] }}
                transition={{
                  repeat: Infinity,
                  duration: 28,
                  ease: "linear"
                }}
                className="flex gap-6 shrink-0"
              >
                {logos.concat(logos).map((logo, i) => (
                  <span 
                    key={i} 
                    className="text-white/20 hover:text-white transition-colors text-[9.5px] font-mono font-bold tracking-widest bg-white/[0.008] border border-white/[0.03] hover:border-white/[0.08] hover:bg-white/[0.015] py-3 px-6 rounded-xl"
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

export const SocialProofExperienceSection = ProofOfExecutionSection;
export default ProofOfExecutionSection;
