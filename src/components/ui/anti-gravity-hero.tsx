import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useTransform } from 'motion/react';
import { useSafeScroll } from '../../hooks/useSafeScroll';
import { ArrowRight, Play, Code, Cpu, Sparkles, Globe, Zap } from 'lucide-react';

// Removed video import
// --- Types ---

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  z: number; // depth layer
  angle: number;
}

interface MouseState {
  x: number;
  y: number;
  isActive: boolean;
}

// --- Configuration Constants ---

const PARTICLE_DENSITY = 0.00006;
const MOUSE_RADIUS = 350;
const RETURN_SPEED = 0.03;
const DAMPING = 0.92;
const REPULSION_STRENGTH = 1.2;

// --- Helper ---

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Pure Grayscale / White particle colors for sharp monochrome aesthetic
const PARTICLE_COLORS = [
  'rgba(255, 255, 255,',  // White
  'rgba(200, 200, 200,',  // Light Grey
  'rgba(150, 150, 150,',  // Silver
  'rgba(100, 100, 100,',  // Dark Grey
];

// --- Canvas Component ---

const AntiGravityCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<MouseState>({ x: -1000, y: -1000, isActive: false });
  const frameIdRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 768;
    const density = isMobile ? PARTICLE_DENSITY * 0.25 : PARTICLE_DENSITY;
    const count = Math.floor(width * height * density);
    const particles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const z = Math.random(); // 0 = far, 1 = near
      const colorIdx = Math.random();
      let color: string;
      if (colorIdx < 0.3) color = PARTICLE_COLORS[0]; 
      else if (colorIdx < 0.45) color = PARTICLE_COLORS[1]; 
      else if (colorIdx < 0.55) color = PARTICLE_COLORS[2]; 
      else color = PARTICLE_COLORS[3]; 
      
      particles.push({
        x, y,
        originX: x,
        originY: y,
        vx: 0, vy: 0,
        size: (0.5 + z * 2.5), // depth = size
        color,
        z,
        angle: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  }, []);

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    timeRef.current = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ambient glow
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const pulse = Math.sin(time * 0.0006) * 0.02 + 0.06;
    
    // Primary White glow
    const g1 = ctx.createRadialGradient(cx * 0.7, cy * 0.8, 0, cx * 0.7, cy * 0.8, Math.max(canvas.width, canvas.height) * 0.5);
    g1.addColorStop(0, `rgba(255, 255, 255, ${pulse * 0.5})`);
    g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Secondary Silver glow
    const g2 = ctx.createRadialGradient(cx * 1.3, cy * 0.5, 0, cx * 1.3, cy * 0.5, Math.max(canvas.width, canvas.height) * 0.4);
    g2.addColorStop(0, `rgba(255, 255, 255, ${pulse * 0.2})`);
    g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Physics
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Mouse repulsion (stronger for nearby particles)
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const effectiveRadius = MOUSE_RADIUS * (0.5 + p.z * 0.5);
      
      if (mouse.isActive && distance < effectiveRadius) {
        const force = (effectiveRadius - distance) / effectiveRadius;
        const repulsion = force * REPULSION_STRENGTH * (0.5 + p.z);
        p.vx -= (dx / distance) * repulsion * 4;
        p.vy -= (dy / distance) * repulsion * 4;
      }

      // Spring back to origin
      p.vx += (p.originX - p.x) * RETURN_SPEED;
      p.vy += (p.originY - p.y) * RETURN_SPEED;
      
      // Gentle ambient drift
      p.angle += 0.002;
      p.vx += Math.cos(p.angle + time * 0.001) * 0.02 * (1 - p.z);
      p.vy += Math.sin(p.angle + time * 0.001) * 0.02 * (1 - p.z);

      // Damping & integration
      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.x += p.vx;
      p.y += p.vy;
    }

    // Draw connections (only between nearby particles)
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = dx * dx + dy * dy;
        const maxDist = 8000; // ~90px
        
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15 * Math.min(a.z, b.z);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw particles (far to near for correct layering)
    const sorted = [...particles].sort((a, b) => a.z - b.z);
    for (const p of sorted) {
      const velocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const baseAlpha = 0.2 + p.z * 0.6;
      const alpha = Math.min(baseAlpha + velocity * 0.08, 1);
      
      // Glow for larger particles
      if (p.z > 0.7) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color + '0.3)';
      }

      ctx.fillStyle = p.color + `${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    frameIdRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
        initParticles(width, height);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [initParticles]);

  useEffect(() => {
    frameIdRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameIdRef.current);
  }, [animate]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, isActive: true };
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseRef.current.isActive = false; }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

// --- Floating 3D Orbit Icons ---

const OrbitIcon: React.FC<{ icon: React.ReactNode; delay: number; radius: number; duration: number }> = ({ icon, delay, radius, duration }) => (
  <motion.div
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5 hidden lg:block"
    animate={{ rotate: 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear", delay }}
  >
    <motion.div
      className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm flex items-center justify-center text-brand-primary/40"
      style={{ transform: `translateX(${radius}px)` }}
      animate={{ rotate: -360 }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    >
      {icon}
    </motion.div>
  </motion.div>
);

// --- Hero Content ---

const HeroContent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useSafeScroll(containerRef, {
    offset: ["start start", "end start"]
  });
  
  // 3D transforms driven by scroll
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const heroRotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Mouse-driven subtle 3D tilt
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <motion.div 
      ref={containerRef}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4"
      style={{
        y: heroY,
        rotateX: heroRotateX,
        scale: heroScale,
        opacity: heroOpacity,
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
    >
      <motion.div 
        className="max-w-5xl w-full text-center space-y-6 md:space-y-8 pointer-events-auto px-4 sm:px-0"
        style={{
          rotateY: mousePos.x * 5,
          rotateX: -mousePos.y * 5,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Soft dark underlay behind text for reliable contrast */}
        <div className="absolute inset-[-10%] bg-black/30 blur-[80px] rounded-[50%] pointer-events-none -z-10" />
        {/* Status badge */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">
            Available for Collaborations
          </span>
        </motion.div>

        {/* Main heading with 3D depth */}
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(3.2rem,8vw,8rem)] font-display font-bold tracking-tighter leading-[1.05] sm:leading-[1] lg:leading-[0.9]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30">
            Building
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent">
            The Future
          </span>
        </motion.h1>

        {/* Subtitle / Identity */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-[clamp(1.1rem,2.5vw,1.5rem)] text-white/60 font-medium tracking-tight leading-relaxed"
        >
          AI & Product Engineer
        </motion.p>

        {/* CTA Buttons - Premium Hierarchy */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-5 pt-8 w-full max-w-sm lg:max-w-none mx-auto"
        >
          {/* Primary CTA */}
          <a 
            href="#hire"
            className="group relative inline-flex items-center justify-center gap-3 w-full lg:w-auto px-10 py-4 bg-white text-black rounded-full font-bold tracking-wide overflow-hidden transition-all hover:scale-[1.03] active:scale-95 shadow-2xl shadow-white/10"
          >
            <span className="relative z-10 glass-text">Hire Me</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:animate-shimmer transition-opacity" />
          </a>
          
          {/* Secondary CTA */}
          <a 
            href="#projects"
            className="group inline-flex items-center justify-center gap-3 w-full lg:w-auto px-10 py-4 bg-white/[0.03] border border-white/10 text-white rounded-full font-bold tracking-wide hover:bg-white/[0.08] hover:border-white/20 transition-all backdrop-blur-md"
          >
            Explore Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* Trust & Authority Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-3 lg:gap-4 pt-10 lg:pt-12 max-w-3xl mx-auto w-full"
        >
          {[
            { label: "4+ Years Building Ideas", icon: <Code size={14} /> },
            { label: "Silicon Valley Quality", icon: <Sparkles size={14} /> },
            { label: "30+ Collaborators", icon: <Globe size={14} /> },
            { label: "Full-Stack & Robotics", icon: <Cpu size={14} /> },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-semibold tracking-wide text-white/50 backdrop-blur-md hover:bg-white/[0.05] hover:text-white/80 transition-all">
              <span className="text-white/70">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Orbiting icons */}
      <OrbitIcon icon={<Code size={20} />} delay={0} radius={280} duration={25} />
      <OrbitIcon icon={<Cpu size={20} />} delay={5} radius={320} duration={30} />
      <OrbitIcon icon={<Sparkles size={20} />} delay={10} radius={260} duration={20} />
      <OrbitIcon icon={<Globe size={20} />} delay={15} radius={340} duration={35} />
    </motion.div>
  );
};

// --- Main Component ---

export default function AntiGravityHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useSafeScroll(containerRef, {
    offset: ["start start", "end start"],
  });

  const fadeOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full py-20 flex items-center justify-center">
      
      {/* 1. LAYER: Monochromic Sharp Grid Background */}
      <motion.div 
        style={{ opacity: fadeOpacity }} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-grid-white"
      />

      {/* 1.5 LAYER: Ambient Backlight Orb */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(400px,60vw)] h-[max(400px,60vw)] max-w-none bg-brand-primary/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(300px,40vw)] h-[max(300px,40vw)] max-w-none bg-brand-secondary/5 rounded-full blur-[100px] animate-pulse-slow delay-1000 pointer-events-none"
        />
      </div>

      {/* 2. LAYER: Ultra-minimalist Monochrome Particles */}
      <AntiGravityCanvas />

      {/* 3. LAYER: Interactive Hero Content */}
      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center pointer-events-auto">
        <HeroContent />
      </div>
      
      {/* Scroll indicator overlay */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/20 z-20 pointer-events-none"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-brand-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
