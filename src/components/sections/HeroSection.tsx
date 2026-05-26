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

export const HeroSection = ({ onViewPortfolio }: { onViewPortfolio?: () => void }) => {
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
      className="relative w-full pt-40 pb-20 flex flex-col justify-center items-center overflow-hidden"
    >
      <Particles />

      {/* Global Neon Glow Engine */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <SectionGlow variant="hero" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          
          {/* Left Column: Systems Positioning */}
          <div className="col-span-12 lg:col-span-7 flex flex-col items-start text-left">
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
                <h1 className="leading-[1.1] tracking-tighter text-left text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem]">
                  Building <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">Experimental Systems</span> <br />
                  & Digital Infrastructure.
                </h1>
              </motion.div>

              <motion.div 
                 variants={VARIANTS.fadeUp}
                 className="space-y-6 mb-10 w-full"
              >
                <p className="text-lg sm:text-xl text-white/50 font-medium leading-relaxed max-w-xl text-left">
                  Operational architectures, low-latency firmware, and physical cybernetics engineered for scalable digital and physical intelligence.
                </p>
                
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                  Active Nodes: VibeCoder OS • Control Systems • Spatial Interfaces
                </div>
              </motion.div>

              {/* Cinematic Ecosystem Navigation */}
              <motion.div
                variants={VARIANTS.fadeUp}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <MagneticButton className="w-full sm:w-auto">
                  <button 
                    onClick={() => handleScrollToSection('systems-ecosystem')}
                    className="group relative flex items-center justify-center px-10 py-4.5 bg-white text-black rounded-2xl font-bold text-base transition-all shadow-[0_20px_50px_rgba(255,255,255,0.05)] active:scale-95 overflow-hidden w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                    <span className="relative z-10 flex items-center gap-2">Explore Systems <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
                  </button>
                </MagneticButton>
                
                <MagneticButton className="w-full sm:w-auto">
                  <button
                    onClick={() => handleScrollToSection('experiments-rd')}
                    className="flex items-center justify-center px-10 py-4.5 glass-card border-white/10 text-white rounded-2xl font-bold text-base hover:bg-white/5 transition-all shadow-xl gap-2.5 group relative overflow-hidden w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                    <span className="relative z-10">View Experiments</span>
                  </button>
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Feature ONE Flagship System (VibeCoder OS) */}
          <div className="col-span-12 lg:col-span-5 flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: EASING.PREMIUM as any }}
              className="w-full max-w-md glass-card rounded-[32px] border border-white/5 hover:border-white/10 shadow-2xl relative bg-[#0D0D0E] group overflow-hidden"
              style={{ willChange: 'transform' }}
            >
              {/* Cover area */}
              <div className="aspect-[16/10] overflow-hidden relative bg-black/40 border-b border-white/5">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" 
                  alt="VibeCoder OS Technical Visual" 
                  className="w-full h-full object-cover opacity-70 group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                
                {/* Overlays */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-bold text-white tracking-widest uppercase">
                    NEURAL INTERFACE
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-brand-primary/20 text-[8px] font-bold text-brand-primary tracking-widest uppercase">
                    v2.4-STABLE
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-bold text-white/80 flex items-center gap-1.5 shadow-lg uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 45ms latency active
                  </span>
                </div>
              </div>

              {/* Details card content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold tracking-tight text-white mb-2 group-hover:text-brand-primary transition-colors">
                  VibeCoder OS
                </h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6 font-medium">
                  Flagship local environment mapping speech inputs directly to production systems execution.
                </p>

                {/* Specs List */}
                <div className="space-y-3 mb-8 pt-4 border-t border-white/5 text-xs text-white/60">
                  <div className="flex justify-between">
                    <span className="text-white/30">Architecture</span>
                    <span className="font-bold">Neural Core Event-Loop</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Interface Nodes</span>
                    <span className="font-bold">Voice & Spatial Audio</span>
                  </div>
                </div>

                {/* Inspect Link */}
                <Link 
                  to="/systems/vibecoder-os" 
                  className="flex items-center justify-center gap-2.5 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold text-sm transition-all uppercase tracking-wider group/inspect"
                >
                  Inspect System Blueprints
                  <ArrowRight size={14} className="group-hover/inspect:translate-x-0.5 transition-transform text-brand-primary" />
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
