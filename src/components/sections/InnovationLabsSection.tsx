import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Cpu, Terminal, Compass, ChevronRight, Activity, Zap } from 'lucide-react';
import { Section } from '../ui/Section';
import { VARIANTS, EASING } from '../../lib/motion-presets';

interface LabConcept {
  id: number;
  title: string;
  category: string;
  status: string;
  description: string;
  hardware: string[];
  software: string[];
  visualMetric: string;
  metricLabel: string;
  telemetry: { label: string; value: string }[];
  icon: React.ReactNode;
}

// ============================================================================
// HELPER: Live Oscilloscope Canvas Grid
// ============================================================================
const OscilloscopeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let phase = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw horizontal baseline
      ctx.strokeStyle = 'rgba(0, 194, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw sine wave signal
      ctx.strokeStyle = 'rgba(0, 194, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.02 + phase) * (height * 0.28) * Math.sin(x * 0.005);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.035;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full pointer-events-none opacity-80" />;
};

export const InnovationLabsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const concepts: LabConcept[] = [
    {
      id: 1,
      title: "Autonomous Marine Vessel Telemetry",
      category: "EDGE GUIDANCE MESH",
      status: "FIRMWARE V2.1 STABLE",
      description: "Arduino-driven telemetry systems featuring custom PID guidance controllers and GPS waypoint routing layers calibrated for lightweight fiberglass hulls.",
      hardware: ["Atmega2560 Core", "Ublox Neo-M8N GPS", "433MHz Telemetry Radio", "Dual 12V High-Torque Thrusters"],
      software: ["Guidance.cpp control loop", "Custom PID steering lib", "Mavlink telemetry packet parsing"],
      visualMetric: "94.6%",
      metricLabel: "GUIDANCE HEADING COEFFICIENT",
      telemetry: [
        { label: "SYS_FREQ", value: "16.0 MHz" },
        { label: "GPS_SATS", value: "12 ACTIVE" },
        { label: "COM_PING", value: "42 ms" },
        { label: "STEER_PID", value: "P=1.2, I=0.04" }
      ],
      icon: <Compass className="text-brand-primary" size={26} />
    },
    {
      id: 2,
      title: "VibeCoder Local LLM Prompt-Compiler",
      category: "COMPILER WORKSPACE",
      status: "COMPILER V1.4 ALPHA",
      description: "An AI-powered system that translates plain-text instructions into efficient, ready-to-run code for local microcontrollers.",
      hardware: ["Nvidia Jetson Orin Nano", "ESP32-S3 WROOM Module", "Holographic telemetry console"],
      software: ["Local model orchestration", "VibeCoder code generator", "OTA compiler pipeline"],
      visualMetric: "0.28s",
      metricLabel: "Blueprints Compile Damping Speed",
      telemetry: [
        { label: "CORE_TEMP", value: "48.5 °C" },
        { label: "LLM_RAM", value: "7.8 GB / 8.0" },
        { label: "CODE_TOK", value: "450 t/sec" },
        { label: "OTA_FREQ", value: "2.4 GHz Wifi" }
      ],
      icon: <Terminal className="text-[#00C2FF]" size={26} />
    },
    {
      id: 3,
      title: "Modular Vibration-Dampened Core Chassis",
      category: "MECHANICAL BLUEPRINT",
      status: "3D milling schema",
      description: "A custom structural chassis designed in Fusion 360 and CNC-milled, built specifically to absorb mechanical noise in high-shock telemetry loads.",
      hardware: ["Aerospace Aluminum 6061-T6", "Thermoelectric peltier modules", "Vibration isolation mounts"],
      software: ["Fusion 360 parametric design", "Thermal dissipation modeler", "SolidWorks stress test simulator"],
      visualMetric: "2.4 Gs",
      metricLabel: "MAX ABSORPTION ACCELERATION",
      telemetry: [
        { label: "CNC_TOL", value: "±0.005 mm" },
        { label: "SHOCK_MAX", value: "3.2 G Peak" },
        { label: "MASS_NET", value: "480 grams" },
        { label: "HEAT_DISS", value: "12W Passive" }
      ],
      icon: <Cpu className="text-brand-primary" size={26} />
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

  const handleNextCard = () => {
    setActiveIndex((prev) => (prev + 1) % concepts.length);
  };

  return (
    <Section 
      id="innovation-labs" 
      glowVariant="center" 
      className="!py-16 md:!py-24 bg-[#0A0A0B] relative overflow-hidden"
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
              <Zap size={14} className="text-[#00C2FF]" /> ACTIVE RESEARCH LABS
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6.5xl font-black tracking-tight text-white leading-[1.08]">
              Experimental <br className="hidden sm:inline" />
              Technology <span className="text-[#00C2FF] font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.2)' }}>Division.</span>
            </h2>
            <p className="text-white/40 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto mt-6">
              Real hardware. Real experiments. Here's how it works.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* LEFT COLUMN: Blueprint Card Stacking Pile (Spans 6 columns) */}
            <div className="lg:col-span-6 relative flex justify-center items-center h-[340px] sm:h-[400px]">
              
              {/* Stack items */}
              <div className="relative w-full max-w-[400px] aspect-[4/3]">
                {concepts.map((concept, i) => {
                  const offsetIndex = (i - activeIndex + concepts.length) % concepts.length;
                  const isTop = offsetIndex === 0;

                  const scale = 1 - offsetIndex * 0.05;
                  const translateY = offsetIndex * 20;
                  const rotate = offsetIndex * 2;
                  const zIndex = concepts.length - offsetIndex;

                  return (
                    <motion.div
                      key={concept.id}
                      animate={{
                        scale,
                        y: translateY,
                        rotate,
                        zIndex,
                        opacity: isTop ? 1 : 0.4 - offsetIndex * 0.1
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 24
                      }}
                      className="absolute inset-0 bg-[#0D0D0E]/60 border border-white/[0.06] rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between select-none"
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
                          {concept.icon}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-[#00C2FF] bg-[#00C2FF]/5 px-2.5 py-1 rounded border border-[#00C2FF]/20 font-mono">
                            {concept.status}
                          </span>
                        </div>
                      </div>

                      <div className="my-6">
                        <span className="text-[7px] font-mono text-white/20 uppercase tracking-[0.2em] block mb-1">
                          {concept.category}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2 leading-snug">
                          {concept.title}
                        </h3>
                        <p className="text-white/40 text-xs leading-relaxed font-semibold font-display line-clamp-2">
                          {concept.description}
                        </p>
                      </div>

                      <div className="border-t border-white/[0.06] pt-4 flex items-center justify-between">
                        <div>
                          <span className="text-[7px] font-bold uppercase tracking-widest text-white/20 block mb-0.5">
                            {concept.metricLabel}
                          </span>
                          <span className="text-lg font-black text-[#00C2FF] tracking-tight font-mono">
                            {concept.visualMetric}
                          </span>
                        </div>
                        
                        {isTop && (
                          <button
                            onClick={handleNextCard}
                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-[#00C2FF] transition-colors cursor-pointer shrink-0"
                            aria-label="Next Concept"
                          >
                            <ChevronRight size={18} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>

            {/* RIGHT COLUMN: Realistic Live Telemetry Diagnostics (Spans 6 columns) */}
            <div className="lg:col-span-6 space-y-8">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: EASING.PREMIUM as any }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-[#00C2FF] bg-[#00C2FF]/5 border border-[#00C2FF]/20 px-3 py-1 rounded-full w-fit block">
                      {concepts[activeIndex].category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                      {concepts[activeIndex].title}
                    </h3>
                  </div>

                  <p className="text-white/45 text-sm sm:text-base leading-relaxed font-semibold font-display">
                    {concepts[activeIndex].description}
                  </p>

                  {/* High-Fidelity Diagnostic Panel */}
                  <div className="grid sm:grid-cols-2 gap-4 border border-white/[0.06] rounded-[24px] bg-[#070708]/80 p-5 relative overflow-hidden">
                    
                    {/* Live Oscilloscope wave canvas */}
                    <div className="absolute inset-0 z-0">
                      <OscilloscopeCanvas />
                    </div>

                    <div className="sm:col-span-2 text-[8px] font-mono font-bold text-white/20 uppercase tracking-[0.2em] border-b border-white/[0.06] pb-2 mb-2 z-10">
                      DIAGNOSTIC TELEMETRY MATRIX
                    </div>

                    {concepts[activeIndex].telemetry.map((t) => (
                      <div key={t.label} className="flex flex-col gap-0.5 bg-black/30 border border-white/[0.04] p-3 rounded-xl backdrop-blur-sm z-10 font-mono">
                        {/* Human-readable label */}
                        <span className="text-[10px] text-white/55 font-semibold leading-tight">
                          {t.label === 'SYS_FREQ' ? 'Clock Speed' :
                           t.label === 'GPS_SATS' ? 'GPS Satellites' :
                           t.label === 'COM_PING' ? 'Network Latency' :
                           t.label === 'STEER_PID' ? 'PID Coefficients' :
                           t.label === 'CORE_TEMP' ? 'Core Temperature' :
                           t.label === 'LLM_RAM' ? 'Memory Usage' :
                           t.label === 'CODE_TOK' ? 'Token Rate' :
                           t.label === 'OTA_FREQ' ? 'Wireless Band' :
                           t.label === 'CNC_TOL' ? 'Milling Tolerance' :
                           t.label === 'SHOCK_MAX' ? 'Shock Resistance' :
                           t.label === 'MASS_NET' ? 'Net Weight' :
                           t.label === 'HEAT_DISS' ? 'Heat Dissipation' :
                           t.label}
                        </span>
                        <span className="text-xs font-black text-[#00C2FF]">{t.value}</span>
                        <span className="text-[8px] text-white/20 uppercase tracking-widest mt-0.5">{t.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Details specs lists - collapsible on mobile */}
                  <div className="grid sm:grid-cols-2 gap-6 pt-2">
                    <div>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-white/20 block mb-2.5">
                        Hardware
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {concepts[activeIndex].hardware.map((hw) => (
                          <span key={hw} className="text-[10px] font-mono text-white/55 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-full">{hw}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-white/20 block mb-2.5">
                        Software
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {concepts[activeIndex].software.map((sw) => (
                          <span key={sw} className="text-[10px] font-mono text-brand-primary/60 bg-brand-primary/[0.04] border border-brand-primary/10 px-2.5 py-1 rounded-full">{sw}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="pt-6">
                <button
                  onClick={handleNextCard}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all py-3.5 px-6 min-h-[44px] rounded-full border border-white/[0.06] hover:border-white/10 bg-white/[0.01] cursor-pointer"
                >
                  Inspect Next Blueprint <ChevronRight size={14} className="text-[#00C2FF]" />
                </button>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </Section>
  );
};
export default InnovationLabsSection;
