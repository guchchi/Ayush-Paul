import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowUpRight, CheckCircle2, Download, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VARIANTS } from '../../lib/motion-presets';

export const HomeActiveSystemsSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setIsSubmitted(true);
  };

  return (
    <Section id="systems" className="border-t border-white/5 bg-[#0A0A0A] relative overflow-hidden">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-[-150px] w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-[-150px] w-96 h-96 bg-brand-primary/3 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16 lg:mb-20">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="ds-section-label"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Ecosystem Registry
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="ds-section-h2"
          >
            Operational <span className="italic font-extrabold text-brand-primary">Systems &amp; Blueprints.</span>
          </motion.h2>

          <motion.p
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="ds-section-body max-w-2xl text-white/50"
          >
            Production-grade hardware and software architectures designed for autonomous robotics. Documented, validated, and open-sourced with premium operational modules.
          </motion.p>
        </div>

        {/* ----------------- LEAD CAPTURE: BUILD YOUR FIRST ROBOTICS SYSTEM ----------------- */}
        <motion.div
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="mb-16 bg-[#101010] border border-white/[0.08] p-8 md:p-10 rounded-[2rem] relative overflow-hidden"
        >
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Value Proposition */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                <Download size={12} />
                Instant Download package
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Build Your First Robotics System
              </h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-xl">
                Get started immediately with a comprehensive starter kit containing full CAD models, schematics, firmware and guides.
              </p>
              
              {/* Bullet checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0" />
                  <span>3 CAD Blueprints (Ayu-Boat/Sensor Hulls)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0" />
                  <span>ESP32 Telemetry Firmware Source Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0" />
                  <span>Interactive Device Wiring Diagrams</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0" />
                  <span>Beginner's Core Guidance Guide (PDF)</span>
                </div>
              </div>
            </div>

            {/* Email Form input block */}
            <div className="lg:col-span-5 w-full bg-white/[0.02] border border-white/[0.06] p-6 rounded-2xl">
              {!isSubmitted ? (
                <form onSubmit={handleDownload} className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">
                    Enter email to get instant download
                  </h4>
                  <div className="flex flex-col gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full h-11 px-4 rounded-xl bg-[#050505] border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-primary font-mono transition-colors"
                    />
                    {errorMsg && (
                      <div className="text-[10px] text-red-400 font-bold flex items-center gap-1 mt-0.5">
                        <AlertCircle size={10} />
                        {errorMsg}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-brand-primary text-black font-extrabold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Download Free Blueprints
                  </button>
                </form>
              ) : (
                <div className="py-6 text-center space-y-3 font-mono">
                  <CheckCircle2 size={36} className="text-brand-primary mx-auto animate-bounce" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Blueprints Ready!</h4>
                  <p className="text-[11px] text-white/50 max-w-xs mx-auto leading-relaxed">
                    Check your inbox. A direct download connection link containing the 3 CAD modules and ESP32 code has been transmitted to <span className="text-brand-primary">{email}</span>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Two-Column Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Ayu-Boat tall card (lg:col-span-7) */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="md:col-span-6 lg:col-span-7 relative isolate h-full"
          >
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="ds-card ds-card-hover p-8 sm:p-10 flex flex-col justify-between h-full group">
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    Autonomous Vessel
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-brand-accent bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      ₹2,499 / Free Blueprint
                    </span>
                    <Link
                      to="/systems/ayu-boat-blueprint"
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-black group-hover:border-brand-primary group-hover:shadow-[0_0_15px_rgba(59,130,246,0.25)] transition-all duration-300 ease-out"
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>
                </div>

                <h3 className="text-white font-extrabold text-3xl mb-4 tracking-tight group-hover:text-brand-primary transition-colors duration-300">Ayu-Boat</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 transition-colors duration-300 group-hover:text-white/60">
                  An autonomous, ESP32-powered aquatic drone engineered for real-time water quality telemetry. Features dual-thruster differential steering, GPS waypoint routing, and modular sensor payload bays.
                </p>

                <div className="flex flex-wrap gap-2.5 mb-8">
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 ease-out cursor-default select-none">
                    ESP32 Firmware
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 ease-out cursor-default select-none">
                    STEP CAD
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 ease-out cursor-default select-none">
                    GPS Navigation
                  </span>
                </div>
              </div>

              {/* Real Project Image overview.jpg */}
              <div className="relative w-full aspect-[16/10] md:aspect-video lg:aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 bg-black/20 mt-auto">
                <img
                  src="/assets/blog-ayu-boat/overview.jpg"
                  alt="Ayu-Boat Pollution Monitoring Robot"
                  className="w-full h-full object-cover brightness-[0.85] contrast-[0.95] group-hover:brightness-95 group-hover:contrast-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&q=80'; }}
                />
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors duration-500" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Stack of two cards (lg:col-span-5) */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between gap-8 h-full">
            
            {/* Top Card: IOBot Blueprint */}
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative isolate flex-grow"
            >
              <div className="absolute -top-16 -right-16 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

              <div className="ds-card ds-card-hover p-8 sm:p-10 flex flex-col justify-between h-full group">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                      Social Companion
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold text-brand-accent bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                        ₹4,999 / Free Blueprint
                      </span>
                      <Link
                        to="/systems/iobot-blueprint"
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-black group-hover:border-brand-primary group-hover:shadow-[0_0_15px_rgba(59,130,246,0.25)] transition-all duration-300 ease-out"
                      >
                        <ArrowUpRight size={18} />
                      </Link>
                    </div>
                  </div>

                  <h3 className="text-white font-extrabold text-2xl mb-3 tracking-tight group-hover:text-brand-primary transition-colors duration-300">IOBot Companion</h3>
                  <p className="text-white/50 text-sm leading-relaxed transition-colors duration-300 group-hover:text-white/60">
                    Smart desktop companion robot featuring haptic actuator synchronization, offline voice synthesis cores, and local computer vision pipelines.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 text-[9px] font-mono">ROS2 Nodes</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 text-[9px] font-mono">3D Print Ready</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 text-[9px] font-mono">Speech Synth</span>
                </div>
              </div>
            </motion.div>

            {/* Bottom Card: Haptic Teleoperation Rig */}
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="relative isolate flex-grow"
            >
              <div className="ds-card ds-card-hover p-8 sm:p-10 flex flex-col justify-between h-full group">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                      Spatial Input
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold text-brand-primary bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                        100% Free
                      </span>
                      <Link
                        to="/systems/haptic-teleoperation-blueprint"
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-black group-hover:border-brand-primary group-hover:shadow-[0_0_15px_rgba(59,130,246,0.25)] transition-all duration-300 ease-out"
                      >
                        <ArrowUpRight size={18} />
                      </Link>
                    </div>
                  </div>

                  <h3 className="text-white font-extrabold text-2xl mb-3 tracking-tight group-hover:text-brand-primary transition-colors duration-300">Haptic Teleoperation Rig</h3>
                  <p className="text-white/50 text-sm leading-relaxed transition-colors duration-300 group-hover:text-white/60">
                    High-precision mechanical linkage controller offering real-time low-latency force feedback telemetry. Stream data directly to humanoid simulators.
                  </p>
                </div>

                <div className="flex gap-8 mt-6">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 block mb-0.5">LATENCY</span>
                    <span className="text-lg font-extrabold text-brand-primary">&lt; 10ms</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 block mb-0.5">BLUEPRINTS</span>
                    <span className="text-lg font-extrabold text-white">Full STEP/STL</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </Section>
  );
};

export default HomeActiveSystemsSection;
