import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useSpring } from 'motion/react';
import { useSafeScroll } from '../../hooks/useSafeScroll';
import { ArrowRight, Github, Linkedin, Youtube } from 'lucide-react';
import { Container } from '../ui/Container';
import { MagneticButton } from '../ui/MagneticButton';
import { SupportButton } from '../ui/SupportButton';
import { cn } from '@/src/lib/utils';
import { VARIANTS, EASING, DURATION } from '../../lib/motion-presets';

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

import { SectionGlow } from '../ui/SectionGlow';

export const HeroSection = ({ onViewPortfolio }: { onViewPortfolio: () => void }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  // Parallax setup for high-prestige feel
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

  return (
    <section 
      id="home"
      ref={containerRef}
      className="relative w-full py-20 flex flex-col justify-center items-center"
    >
      {/* Global Neon Glow Engine — variant: hero */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <SectionGlow variant="hero" />
      </div>

      {/* Hero Content — isolated at z-10 */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-center lg:justify-between">
          
          {/* Left Social Rail (lg only) */}
          <div className="hidden lg:flex w-64 items-center justify-start min-w-0">
            <div className="flex flex-col gap-6">
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
                  transition={{ delay: 1.2 + i * 0.1, ease: EASING.PREMIUM }}
                  whileHover={{ x: 5, color: "var(--color-brand-primary)", opacity: 1 }}
                  className={cn("block text-white/30 transition-all hover:text-brand-primary")}
                >
                  {item.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Center Hero Content */}
          <div className="flex flex-col justify-center items-center w-full max-w-3xl mx-auto">
            <motion.div 
              className="w-full text-center flex flex-col items-center"
              variants={VARIANTS.staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* High-Authority Identity Badge */}
              <motion.div
                variants={VARIANTS.fadeUp}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-6 sm:py-3 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-white/50 opacity-80 backdrop-blur-md shadow-2xl mb-6 max-w-full"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-primary animate-pulse shrink-0" />
                <span className="truncate">Builder • Developer • Creative Tech</span>
              </motion.div>

              {/* Power Headline & Authority Statement */}
              <motion.div variants={VARIANTS.fadeUp} className="space-y-3 sm:space-y-5 w-full break-words">
                <h1 className="font-display font-semibold tracking-tight leading-[1.1] text-white text-[2.5rem] sm:text-7xl w-full break-words">
                  I Design & Engineer <br />
                  Digital Experiences
                </h1>
                <h1 className="font-display font-semibold tracking-tight leading-tight text-brand-primary italic w-full break-words text-3xl sm:text-6xl">
                  That Feel Alive.
                </h1>
              </motion.div>

              <motion.div 
                 variants={VARIANTS.fadeUp}
                 className="flex flex-col gap-5 w-full mt-6"
              >
                <p className="text-sm sm:text-2xl text-neutral-400 sm:text-white/50 w-full max-w-[300px] sm:max-w-2xl mx-auto leading-relaxed font-medium break-words">
                  I build production-ready systems combining engineering, design, and AI automation.
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/40 w-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping shrink-0" />
                  Currently Building: AI Tools • Creative Systems
                </div>
              </motion.div>

              <motion.div
                variants={VARIANTS.fadeUp}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full relative z-20 mt-10"
              >
                {/* Primary: Work With Me */}
                <MagneticButton 
                   className="w-full sm:w-auto overflow-hidden relative"
                >
                  <a 
                    href="#contact" 
                    className="inline-flex items-center justify-center w-full max-w-[280px] sm:max-w-none mx-auto min-h-[48px] px-8 sm:px-14 py-4 bg-white text-black rounded-2xl sm:rounded-3xl font-bold text-lg transition-all shadow-2xl hover:scale-[1.02] active:scale-95"
                  >
                    Work With Me
                  </a>
                </MagneticButton>
                
                {/* Secondary: View Projects */}
                <MagneticButton
                  onClick={onViewPortfolio}
                  className="w-full sm:w-auto overflow-hidden relative"
                >
                  <div className="inline-flex items-center justify-center w-full max-w-[280px] sm:max-w-none mx-auto min-h-[48px] px-8 sm:px-14 py-4 bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl font-bold text-lg hover:bg-white/[0.08] hover:border-white/20 transition-all backdrop-blur-md text-white shadow-xl gap-3 group cursor-pointer">
                    View Projects <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </MagneticButton>
              </motion.div>

              {/* Bottom Breathing Space */}
              <div className="mt-8 pb-6 w-full sm:hidden" />
            </motion.div>
          </div>

          {/* Right Breathing Space (lg only) */}
          <div className="hidden lg:block w-64" />
        </div>
      </div>
    </section>
  );
};
