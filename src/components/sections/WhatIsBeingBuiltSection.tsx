import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Section } from '../ui/Section';
import { GitBranch, Cpu, Compass, Server, Radio, ShieldCheck, ChevronRight, Activity, Terminal, Code, Laptop, Layers } from 'lucide-react';
import DomeGallery from '../ui/DomeGallery';

// ============================================================================
// CONFIGURATION & SEED DATA (Preserved Core Content)
// ============================================================================
const EXPERIMENTS = [
  {
    id: "EXP-08",
    name: "H2R Servo Calibration",
    category: "Robotics Core",
    progress: 88,
    status: "ACTIVE TESTING",
    color: "#00C2FF",
    specs: ["ESP32-S3", "16-Channel PWM", "IMU-6050 feedback"],
    metrics: { voltage: "5.2V", torque: "28kg-cm", drift: "<0.08°" },
    action: "ACCESS_CORE",
    icon: <Cpu size={24} />
  },
  {
    id: "EXP-09",
    name: "VibeCoder OTA Compiler",
    category: "Software / AI",
    progress: 74,
    status: "INCUBATING",
    color: "#7B61FF",
    specs: ["Jetson Nano", "Local Compiler Hook", "C++ Translation"],
    metrics: { latency: "0.38ms", accuracy: "99.4%", memory: "1.2GB" },
    action: "COMPILE_EDGE",
    icon: <Laptop size={24} />
  },
  {
    id: "EXP-10",
    name: "Tactile Robotics Kit",
    category: "Educational Product",
    progress: 92,
    status: "BETA ASSEMBLY",
    color: "#00FF66",
    specs: ["SLA Resin CAD", "Modular Snap-fit", "I2C Sensor Core"],
    metrics: { units: "12 nodes", refresh: "400Hz", error: "0.01%" },
    action: "VIEW_SCHEMATICS",
    icon: <Layers size={24} />
  }
];

const ROADMAP_PHASES = [
  {
    phase: "PHASE 01",
    title: "Cyber-Physical Prototyping",
    status: "ACTIVE BUILDING",
    desc: "Assembling custom bipedal kinematics, designing CNC-milled aluminum shells, and establishing edge firmware communication layers.",
    color: "#00C2FF"
  },
  {
    phase: "PHASE 02",
    title: "Ecosystem Assets & Kits",
    status: "INCUBATING",
    desc: "Distilling modular engineering processes into tactile hardware kits, technical learning guides, and web-based interactive control dashboards.",
    color: "#7B61FF"
  },
  {
    phase: "PHASE 03",
    title: "Autonomous Startup Node",
    status: "HORIZON PHASE",
    desc: "Unifying bipedal control systems, local neural networks, and scalable SaaS infrastructure into a commercial hardware-software startup venture.",
    color: "#FF9900"
  }
];

const MOCK_LOGS = [
  { time: "10:39:11", node: "sys-init", type: "system", msg: "systemctl: initializing local agent node connection..." },
  { time: "10:39:14", node: "core-08", type: "success", msg: "status: ok - connected to [ESP32-CORE-08]" },
  { time: "10:39:16", node: "telemetry", type: "telemetry", msg: "telemetry: pitch=1.04 rad, roll=-0.08 rad, balance=stabilized" },
  { time: "10:39:19", node: "compiler", type: "process", msg: "compiler: building H2R_kinematic_filter.cpp..." },
  { time: "10:39:22", node: "compiler", type: "process", msg: "compiler: optimizing servo loop calculations (latency=0.38ms)" },
  { time: "10:39:25", node: "ota-firm", type: "success", msg: "firmware: successfully flashed OTA partition [v2.1.0-alpha]" },
  { time: "10:39:28", node: "diagnose", type: "system", msg: "diagnostics: checking thermal margins... 38.4°C [optimal]" },
  { time: "10:39:31", node: "telemetry", type: "success", msg: "status: monitoring active. streaming telemetry payload..." }
];

const DOME_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1631553127988-a764d930c6a5?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop"
];

// ============================================================================
// MAIN COMPONENT REDESIGN: Realignment with provided design structure
// ============================================================================
export const WhatIsBeingBuiltSection = () => {
  const [logs, setLogs] = useState<typeof MOCK_LOGS>([]);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Simulated live operator event stream (Closure safe)
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < MOCK_LOGS.length) {
        const nextLog = MOCK_LOGS[index];
        setLogs(prev => [...prev, nextLog]);
        index++;
      } else {
        setLogs([]);
        index = 0;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Scroll stream terminal container smoothly
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTo({
        top: terminalContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  return (
    <Section
      id="what-is-being-built"
      glowVariant="side"
      className="py-24 md:py-32 border-t border-white/[0.04] bg-[#070708] relative overflow-hidden"
    >
      {/* High-end microscopic grid background layer */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20 z-0" />

      {/* Floating subtle ambient design orb */}
      <div className="absolute -top-40 right-10 w-[500px] h-[500px] glow-orb glow-cyan opacity-[0.03] z-0" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10" ref={sectionRef}>
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#00C2FF] font-semibold uppercase block">
              // 01: THE ECOSYSTEM
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-none">
              THE EMPIRES
            </h2>
          </div>
          <p className="max-w-md text-white/40 text-[14px] font-medium leading-relaxed font-sans">
            Shift focus from static archives to continuous momentum. A ledger of ongoing robotic prototypes, software builds, and long-term startup blueprints.
          </p>
        </div>

        {/* 1. THREE-CARD GRID: Exact copy of screenshot design structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {EXPERIMENTS.map((item, idx) => (
            <div
              key={item.id}
              className="relative rounded-2xl bg-[#09090A] border border-white/[0.03] p-8 flex flex-col justify-between min-h-[360px] overflow-hidden hover:border-white/[0.08] hover:scale-[1.01] active:scale-[0.995] cursor-pointer transition-all duration-500 group"
            >
              {/* Custom square graph-paper grid backdrop */}
              <div 
                className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity pointer-events-none z-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Ambient radial glow following item colors */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl blur-3xl z-0"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${item.color}0c, transparent 60%)`
                }}
              />

              {/* Top border ambient shimmer */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${item.color}35, transparent)`
                }}
              />

              {/* Top Row: Icon + status badge inside fine border */}
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div 
                  className="transition-all duration-500"
                  style={{ 
                    color: item.color,
                    filter: `drop-shadow(0 0 6px ${item.color}40)`
                  }}
                >
                  {item.icon}
                </div>
                <span className="text-[8px] font-mono tracking-widest text-white/40 uppercase font-black border border-white/10 px-2.5 py-0.5 rounded bg-white/[0.01]">
                  {item.status}
                </span>
              </div>

              {/* Middle Row: Content */}
              <div className="space-y-3 relative z-10 flex-grow">
                <h3 className="text-[9px] font-mono font-bold tracking-widest text-[#00C2FF] uppercase">
                  {item.category} — {item.id}
                </h3>
                <h4 className="text-xl font-bold text-white tracking-tight leading-snug">
                  {item.name}
                </h4>
                <p className="text-[13px] text-white/40 leading-relaxed font-medium">
                  {item.specs.join(', ')} configurations. Formulating modular firmware stacks with integrated real-time telemetry metrics: {Object.entries(item.metrics).map(([k, v]) => `${k}:${v}`).join(', ')}.
                </p>
              </div>

              {/* Bottom Row: Link with translation arrow */}
              <div className="pt-8 relative z-10 border-t border-white/[0.02] flex items-center justify-between">
                <span 
                  className="text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5"
                  style={{ color: item.color }}
                >
                  {item.action}
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
                <span className="text-[11px] font-mono text-white/20 font-black">{item.progress}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. SIMULATED OPERATIONAL TERMINAL: Docked full-width underneath */}
        <div className="bg-[#080809] border border-white/[0.04] rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl relative mb-16">
          {/* Operations Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.03] bg-white/[0.003]">
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-white/5 border border-white/10" />
              <span className="w-2 h-2 rounded-full bg-white/5 border border-white/10" />
              <span className="w-2 h-2 rounded-full bg-white/5 border border-white/10" />
            </div>
            <span className="text-[9px] font-mono tracking-[0.2em] text-white/20 flex items-center gap-1.5 font-semibold">
              <Terminal size={11} className="text-white/20" /> OPERATIONAL_STREAM
            </span>
            <div className="flex items-center gap-2 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <Radio size={9} className="text-emerald-500 animate-pulse" />
              <span className="text-[7.5px] font-mono text-emerald-500 font-black tracking-widest">STREAM</span>
            </div>
          </div>

          {/* Event Telemetry Screen Area */}
          <div
            ref={terminalContainerRef}
            className="p-5 font-mono text-[10px] leading-relaxed text-white/40 space-y-3.5 min-h-[220px] max-h-[220px] bg-black/25 overflow-y-auto custom-scrollbar select-text"
          >
            <AnimatePresence>
              {logs.length === 0 ? (
                <div className="text-white/20 animate-pulse text-center py-6">
                  Initializing operational telemetry stream...
                </div>
              ) : (
                logs.filter(Boolean).map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-0.5 border-b border-white/[0.01] pb-1.5 last:border-0 hover:bg-white/[0.005] px-1 rounded transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white/25 text-[8.5px]">{log.time}</span>
                        <span
                          className="px-1.5 py-0.2 rounded text-[7.5px] font-black uppercase tracking-widest bg-white/5 border border-white/10"
                          style={{
                            color: log.type === 'success' ? '#00FF66' : log.type === 'telemetry' ? '#7B61FF' : log.type === 'process' ? '#00C2FF' : '#ffffff80'
                          }}
                        >
                          {log.node}
                        </span>
                      </div>
                      <span className="text-[8px] text-white/10 select-none">NODE_STREAM</span>
                    </div>
                    <span className="text-white/60 pl-1 select-all">{log.msg}</span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3D Visual Sandbox Frame (Consolidated width) */}
        <div className="w-full h-[400px] relative rounded-2xl overflow-hidden border border-white/[0.03] bg-[#070709] mb-16 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">
          <div className="absolute top-4 left-6 z-20 flex items-center gap-3 font-mono text-[9px] text-[#00C2FF] bg-black/60 px-4 py-2 border border-[#00C2FF]/20 rounded-full tracking-widest uppercase shadow-[0_8px_16px_rgba(0,0,0,0.5)] select-none">
            <span className="w-2 h-2 rounded-full bg-[#00C2FF] animate-pulse" />
            3D TELEMETRY SANDBOX — ACTIVE DRAG VIEWPORT
          </div>
          
          <DomeGallery
            images={DOME_IMAGE_POOL}
            grayscale={false}
            openedImageWidth="280px"
            openedImageHeight="340px"
            overlayBlurColor="#070708"
            fit={0.45}
          />
        </div>

        {/* Bento-Grid Multi-Phase Roadmap */}
        <div className="bg-[#09090A] border border-white/[0.03] rounded-2xl p-8 sm:p-10 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-5 mb-10">
            <div className="flex items-center gap-3">
              <Compass size={15} className="text-[#00FF66]" />
              <span className="text-[9px] font-mono font-bold tracking-widest text-white/30 uppercase">TACTICAL MULTI-PHASE ROADMAP</span>
            </div>
            <span className="text-[9px] font-mono text-white/20 tracking-wider font-semibold">HORIZON 2025 - 2026</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            <div className="hidden lg:block absolute top-10 left-16 right-16 h-px bg-gradient-to-r from-[#00C2FF]/15 via-[#7B61FF]/15 to-[#FF9900]/5 pointer-events-none z-0" />

            {ROADMAP_PHASES.map((phase, idx) => (
              <div
                key={idx}
                className="relative z-10 space-y-6 p-6 rounded-xl bg-white/[0.005] border border-white/[0.02] hover:border-white/[0.05] hover:bg-white/[0.015] hover:scale-[1.01] active:scale-[0.995] cursor-pointer transition-all duration-500 group flex flex-col justify-between min-h-[200px] overflow-hidden"
              >
                {/* Visual SVG blueprint in background */}
                <div className="absolute -right-8 -bottom-8 w-28 h-28 opacity-[0.03] group-hover:opacity-[0.09] transition-all duration-700 pointer-events-none z-0">
                  {idx === 0 && (
                    <svg viewBox="0 0 100 100" className="w-full h-full stroke-current text-[#00C2FF] animate-[spin_30s_linear_infinite]">
                      <circle cx="50" cy="50" r="40" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                      <line x1="10" y1="50" x2="90" y2="50" strokeWidth="0.5" />
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg viewBox="0 0 100 100" className="w-full h-full stroke-current text-[#7B61FF] animate-[spin_20s_linear_infinite]">
                      <rect x="25" y="25" width="50" height="50" rx="4" strokeWidth="1" fill="none" />
                      <line x1="15" y1="15" x2="85" y2="85" strokeWidth="0.5" />
                    </svg>
                  )}
                  {idx === 2 && (
                    <svg viewBox="0 0 100 100" className="w-full h-full stroke-current text-[#FF9900] animate-[spin_40s_linear_infinite]">
                      <polygon points="50,15 85,75 15,75" strokeWidth="1" fill="none" />
                      <line x1="50" y1="15" x2="50" y2="75" strokeWidth="0.5" />
                    </svg>
                  )}
                </div>

                <div className="space-y-4 relative z-10">
                  <div
                    className="w-10 h-10 rounded-xl bg-black/40 border flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-105"
                    style={{ borderColor: `${phase.color}20` }}
                  >
                    <span className="text-[10px] font-mono font-bold" style={{ color: phase.color }}>
                      {phase.phase.split(' ')[1]}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                        {phase.title}
                      </h3>
                      <span
                        className="text-[7px] font-mono tracking-widest uppercase font-black px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.05]"
                        style={{ color: phase.color }}
                      >
                        {phase.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed font-medium">
                      {phase.desc}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-3 relative z-10">
                  <ChevronRight
                    size={13}
                    className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300"
                    style={{ color: phase.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Section>
  );
};

export default WhatIsBeingBuiltSection;
