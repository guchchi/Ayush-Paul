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
      className="relative w-full pt-32 pb-20 flex flex-col justify-center items-center"
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
          <div className="flex flex-col justify-center items-center w-full max-w-4xl mx-auto">
            <motion.div 
              className="w-full text-center flex flex-col items-center"
              variants={VARIANTS.staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* High-Authority Identity Badge */}
              <motion.div
                variants={VARIANTS.fadeUp}
                className="badge mb-6 sm:mb-8 shadow-2xl shadow-brand-primary/10"
              >
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                <span className="tracking-[0.25em]">Builder • Developer • Creative Tech</span>
              </motion.div>

              {/* Power Headline & Authority Statement */}
              <motion.div variants={VARIANTS.fadeUp} className="mb-10 sm:mb-16">
                <h1 className="leading-[1.1]">
                  I Design & Engineer <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">Digital Experiences</span>
                  <br />
                  <span className="text-brand-primary italic block mt-2 sm:mt-4 text-[clamp(2.5rem,8vw,5.5rem)] font-extrabold">
                    That Feel Alive.
                  </span>
                </h1>
              </motion.div>

              <motion.div 
                 variants={VARIANTS.fadeUp}
                 className="space-y-8 mb-12 sm:mb-20"
              >
                <p className="text-xl sm:text-3xl text-white/50 max-w-2xl mx-auto font-medium leading-tight">
                  I build production-ready systems combining engineering, design, and AI automation.
                </p>
                
                <div className="flex items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-ping" />
                  Currently Building: AI Tools • Creative Systems
                </div>
              </motion.div>

              <motion.div
                variants={VARIANTS.fadeUp}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg mx-auto"
              >
                <MagneticButton className="w-full sm:w-auto">
                  <a 
                    href="#contact" 
                    className="flex items-center justify-center px-12 py-5 bg-white text-black rounded-3xl font-bold text-xl hover:scale-[1.02] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95"
                  >
                    Work With Me
                  </a>
                </MagneticButton>
                
                <MagneticButton
                  onClick={onViewPortfolio}
                  className="w-full sm:w-auto"
                >
                  <div className="flex items-center justify-center px-12 py-5 glass-card border-white/10 text-white rounded-3xl font-bold text-xl hover:bg-white/5 transition-all shadow-xl gap-3 group">
                    View Projects <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Breathing Space (lg only) */}
          <div className="hidden lg:block w-64" />
        </div>
      </div>
    </section>
  );
};
