import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { useSafeScroll } from '../../hooks/useSafeScroll';
import { ArrowRight, Github, Linkedin, Youtube, ShieldCheck } from 'lucide-react';
import { Container } from '../ui/Container';
import { MagneticButton } from '../ui/MagneticButton';
import { cn } from '@/src/lib/utils';
import { VARIANTS, EASING } from '../../lib/motion-presets';
import { SectionGlow } from '../ui/SectionGlow';

const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      twinkleSpeed: number;
      color: string;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.twinkleSpeed = Math.random() * 0.01 + 0.005;
        this.color = `rgba(255, 255, 255,`;
      }

      update(width: number, height: number, mX: number, mY: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.twinkleSpeed;
        if (this.opacity > 0.7 || this.opacity < 0.1) {
          this.twinkleSpeed = -this.twinkleSpeed;
        }

        const dx = mX - this.x;
        const dy = mY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) {
          const force = (150 - distance) / 150;
          this.x -= dx * force * 0.015;
          this.y -= dy * force * 0.015;
        }

        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `${this.color}${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 120 }, () => new Particle(canvas.width, canvas.height));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(canvas.width, canvas.height, mousePos.current.x, mousePos.current.y);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

export const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useSafeScroll(containerRef);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const ySpring = useSpring(yParallax, { stiffness: 100, damping: 30 });

  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ 
          x: (e.clientX - window.innerWidth / 2) / 40, 
          y: (e.clientY - window.innerHeight / 2) / 40 
        });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      id="home"
      ref={containerRef}
      className="relative w-full pt-44 pb-20 flex flex-col justify-center items-center overflow-hidden"
    >
      <Particles />

      {/* Global Neon Glow Engine */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <SectionGlow variant="hero" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Social Rail + Grid Container */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
          
          {/* Left Social Rail */}
          <div className="hidden lg:flex flex-col gap-6 pt-4">
            {[
              { icon: <Github size={20} />, href: "https://github.com/guchchi/Ayush-Paul" },
              { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/paulayush/" },
              { icon: <Youtube size={20} />, href: "https://www.youtube.com/@ALX-17" }
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.1, ease: EASING.PREMIUM as any }}
                whileHover={{ x: 5, color: "var(--color-brand-primary)", opacity: 1 }}
                className={cn("block text-white/30 transition-all hover:text-brand-primary")}
              >
                {item.icon}
              </motion.a>
            ))}
          </div>

          {/* Main Hero Content: Grid Layout */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 w-full items-center">
            
            {/* LEFT COLUMN: Concise Operational Messaging */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <motion.div 
                className="w-full flex flex-col items-start"
                variants={VARIANTS.staggerContainer}
                initial="initial"
                animate="animate"
              >
                {/* Premium Systems Badge */}
                <motion.div
                  variants={VARIANTS.fadeUp}
                  className="badge mb-6 shadow-2xl shadow-brand-primary/10"
                >
                  <ShieldCheck size={14} className="text-brand-primary animate-pulse" />
                  <span className="tracking-[0.25em] uppercase">Antigravity • Engineering Intelligence</span>
                </motion.div>

                {/* Power Headline */}
                <motion.div variants={VARIANTS.fadeUp} className="mb-6">
                  <h1 className="leading-[1.1] tracking-tighter text-left">
                    <span className="sr-only">Antigravity</span>
                    Operational Systems for <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">Digital & Physical</span>
                    <span className="text-brand-primary italic block mt-1 text-[clamp(2.2rem,6vw,4.2rem)] font-extrabold">
                      Intelligence.
                    </span>
                  </h1>
                </motion.div>

                <motion.div 
                   variants={VARIANTS.fadeUp}
                   className="space-y-6 mb-10 w-full"
                >
                  <p className="text-lg sm:text-xl text-white/50 leading-relaxed font-medium">
                    Research-driven systems, robotics infrastructure, modular tooling, and deployable intelligence architectures.
                  </p>
                  
                  <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-white/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                    Nodes Live: VibeCoder OS • Control Systems • Blueprints
                  </div>
                </motion.div>

                {/* Spacing and CTA Alignment */}
                <motion.div
                  variants={VARIANTS.fadeUp}
                  className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                >
                  <MagneticButton className="w-full sm:w-auto">
                    <button 
                      onClick={() => handleScrollToSection('systems-ecosystem')}
                      className="group relative flex items-center justify-center px-8 py-4 bg-white text-black rounded-2xl font-bold text-sm transition-all shadow-[0_15px_30px_rgba(255,255,255,0.05)] active:scale-95 overflow-hidden w-full sm:w-auto cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                      <span className="relative z-10 flex items-center gap-2">Explore Systems <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
                    </button>
                  </MagneticButton>
                  
                  <MagneticButton className="w-full sm:w-auto">
                    <button
                      onClick={() => handleScrollToSection('research-publications')}
                      className="flex items-center justify-center px-8 py-4 glass-card border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/5 transition-all shadow-xl gap-2.5 group relative overflow-hidden w-full sm:w-auto cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                      <span className="relative z-10">View Research</span>
                    </button>
                  </MagneticButton>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Premium Flagship Systems Module (VibeCoder OS Register) */}
            <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASING.PREMIUM as any, delay: 0.3 }}
                className="w-full max-w-[480px] bg-[#0C0D0E]/90 border border-white/5 rounded-[28px] overflow-hidden shadow-2xl relative"
              >
                {/* Subtle cyan neon glow overlay inside */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/[0.02] to-transparent pointer-events-none" />

                {/* Simulated Console Title bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-white/30">SYSTEMS_CORE_REGISTER</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-[9px] font-mono text-brand-primary font-bold">ONLINE</span>
                  </div>
                </div>

                {/* Showcase Body */}
                <div className="p-8 space-y-6">
                  {/* System Header */}
                  <div>
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1.5">Centerpiece Node</div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-3xl font-bold tracking-tight text-white font-display">VibeCoder OS</h3>
                      <span className="px-2.5 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/25 text-brand-primary text-[9px] font-mono font-bold tracking-wider">
                        v1.4.0-alpha
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/30" /> CLASSIFICATION: CYBERNETIC WORKFLOWS
                    </div>
                  </div>

                  {/* Operational Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                      <div className="text-[8px] font-mono text-white/35 uppercase tracking-widest mb-1">DEPLOY_STATE</div>
                      <div className="text-xs font-bold text-white tracking-wider">DEPLOYED (ACTIVE)</div>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                      <div className="text-[8px] font-mono text-white/35 uppercase tracking-widest mb-1">BLUEPRINT</div>
                      <div className="text-xs font-bold text-brand-primary tracking-wider">OPEN BLUEPRINT</div>
                    </div>
                  </div>

                  {/* Modular Asset Indicators */}
                  <div className="space-y-3 pt-2">
                    <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.25em]">Included Infrastructure Modules</div>
                    
                    <div className="space-y-2">
                      {[
                        { title: "Autonomous Telemetry Pipeline", status: "Active", type: "Core Module" },
                        { title: "Unified Context Compiler", status: "Active", type: "Core Module" },
                        { title: "Edge Hardware Gateway Core", status: "Synced", type: "Asset Resource" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-semibold text-white/60 bg-white/[0.02] border border-white/[0.03] p-3 rounded-xl">
                          <span className="flex items-center gap-2 truncate pr-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/60 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </span>
                          <span className="text-[8px] font-mono text-white/30 uppercase shrink-0 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real-time Telemetry Monitor Simulation */}
                  <div className="bg-black/35 rounded-2xl p-4 border border-white/5 font-mono text-[9px] text-white/35 space-y-1">
                    <div className="flex justify-between text-white/20 border-b border-white/5 pb-1.5 mb-1.5">
                      <span>CONSOLE LOGS</span>
                      <span>SYNC_VELOCITY: 100%</span>
                    </div>
                    <div className="text-brand-primary/80">&gt; Loading system context configurations... OK</div>
                    <div>&gt; Pipeline synchronized. Listening on port 8080</div>
                    <div className="flex items-center gap-1.5">
                      <span>&gt; Diagnostics telemetry integrity check</span>
                      <span className="text-green-500 font-bold">100%</span>
                    </div>
                  </div>

                  {/* Action Link to the details */}
                  <div className="pt-2">
                    <Link
                      to="/systems/vibecoder-os"
                      className="group/btn w-full py-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-primary/20 text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-white rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Inspect VibeCoder Blueprint
                      <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
