import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { Section } from '../ui/Section';
import { ShieldAlert, ArrowRight, Download, Lock, CheckCircle, Database } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

export const VaultHighlightSection = () => {
  const fileAssets = [
    { name: 'vibecoder_compiler_v1.4.0.zip', size: '42.8 MB', hash: 'SHA256: d8f3...a9b2', type: 'CORE SYSTEM' },
    { name: 'ayu_boat_mechanical_assembly.pdf', size: '12.4 MB', hash: 'SHA256: c3a4...e8f9', type: 'PDF MANUAL' },
    { name: 'chassis_armor_3d_milling.step', size: '48.2 MB', hash: 'SHA256: f1b2...c3d4', type: 'CAD STEP FILE' },
    { name: 'esp32_autonomous_control_loop.ino', size: '180 KB', hash: 'SHA256: e5f6...7890', type: 'FIRMWARE C++' }
  ];

  // 3D Perspective Scroll Container Reference
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

  // Interactive 3D Mouse Tilt State for Mainframe Visual
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(0);
  const [glowY, setGlowY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Smooth angle mapping
    const rY = ((mouseX / width) - 0.5) * 12;
    const rX = (0.5 - (mouseY / height)) * 12;
    
    setRotateX(rX);
    setRotateY(rY);
    setGlowX(mouseX);
    setGlowY(mouseY);
  };

  return (
    <Section 
      id="vault-highlight" 
      glowVariant="bottom" 
      className="py-24 md:py-32 border-t border-white/[0.08] bg-[#0A0A0B] relative overflow-hidden"
    >
      {/* Cybernetic Micro-Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-60 z-0" />
      
      {/* Projection Cyber Glow Source */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-brand-accent/5 rounded-full filter blur-[120px] pointer-events-none z-0 animate-pulse" />

      <div ref={sectionRef} className="w-full h-full relative z-10" style={{ perspective: 1200 }}>
        <motion.div 
          style={{ rotateX: rotateXSection, y: translateYSection, scale: scaleSection, opacity: opacitySection, transformStyle: "preserve-3d" }}
          className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        >
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: Cryptographic Mock Storage Mainframe Visual */}
            <div className="lg:col-span-6 w-full flex justify-center">
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setRotateX(0);
                  setRotateY(0);
                }}
                className="w-full max-w-[480px] bg-[#0C0D0E]/40 backdrop-blur-xl border border-white/[0.08] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.55)] relative cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                  transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
                  willChange: "transform"
                }}
              >
                {/* 3D Glowing Shimmer Grid overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-[32px] overflow-hidden"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(circle 240px at ${glowX}px ${glowY}px, rgba(0, 194, 255, 0.14), transparent 80%)`
                  }}
                />

                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/[0.01] to-transparent pointer-events-none" />

                {/* Title Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.01]">
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-white/30">DECRYPTED_NODE_REPOSITORY</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-green-500 font-bold">SECURE_SYNCED</span>
                  </div>
                </div>

                {/* File Stack List */}
                <div className="p-6 space-y-4">
                  <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.25em] mb-2 block">Licensed Infrastructure Blueprints</div>
                  <div className="space-y-3">
                    {fileAssets.map((asset, idx) => (
                      <div 
                        key={idx}
                        className="bg-white/[0.01] border border-white/[0.06] hover:bg-white/[0.03] hover:border-brand-accent/20 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-2 py-0.5 rounded bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[8px] font-mono font-bold tracking-wider">
                              {asset.type}
                            </span>
                            <span className="text-[9px] font-mono text-white/20">{asset.size}</span>
                          </div>
                          <div className="text-xs font-bold text-white/80 font-mono truncate">{asset.name}</div>
                          <div className="text-[8px] font-mono text-white/25 mt-1">{asset.hash}</div>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/30 shrink-0">
                          <Lock size={12} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Handshake Telemetry */}
                  <div className="bg-black/35 rounded-2xl p-4 border border-white/[0.08] font-mono text-[9px] text-white/35 space-y-1 mt-4">
                    <div className="flex justify-between text-white/20 border-b border-white/[0.08] pb-1.5 mb-1.5">
                      <span>SECURITY SHIELD ACTIVE</span>
                      <span>128-BIT TLS</span>
                    </div>
                    <div>&gt; Authenticating hardware keystone handshake...</div>
                    <div className="text-brand-accent/80">&gt; Identity verified. Blueprint extraction permitted.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Copy and Vault Positioning */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <motion.div
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="badge mb-6 shadow-[0_0_20px_rgba(0,194,255,0.08)] bg-white/[0.02] border border-white/[0.08] text-[10px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-1.5 px-4 py-2 rounded-full"
              >
                <Database size={14} className="text-brand-accent" /> Premium Storage Hub
              </motion.div>
              
              <motion.h2
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="text-4xl md:text-5.5xl font-black tracking-tight text-white mt-6 leading-[1.1]"
              >
                Your Private <span className="text-brand-accent font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.28)' }}>Systems Vault.</span>
              </motion.h2>

              <motion.p
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="text-white/40 text-base md:text-lg font-medium leading-relaxed mt-6 mb-8 max-w-xl"
              >
                Positioned as a secure, high-integrity digital asset registry. Authenticated users gain private access to downloaded control loops, premium STEP assemblies, custom CAD blueprints, and platform firmware layers.
              </motion.p>

              {/* Checklist of Features */}
              <motion.div
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="space-y-4 mb-10 w-full"
              >
                {[
                  'Encrypted blueprint and licensing storage key mapping',
                  'Downloadable premium hardware layout and firmware configurations',
                  'Versioned assembly logs and structural CAD assets',
                  'Seamless, offline local-host integration pipelines'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-semibold text-white/70">
                    <CheckCircle size={16} className="text-brand-accent shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Link */}
              <motion.div
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/vault"
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black hover:bg-brand-accent hover:text-black rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95 overflow-hidden w-full sm:w-auto cursor-pointer"
                >
                  <span>Authenticate & Access Vault</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </Section>
  );
};
export default VaultHighlightSection;
