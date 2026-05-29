import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Section } from '../ui/Section';
import { Globe, Sparkles } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

export const VisionFutureSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse coordinate tracking for the pulsing digital core
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Starfield Simulation Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
    const particleCount = 100;

    // Initialize particles (starfield coordinates)
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random()
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Main Draw loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 194, 255, 0.05)';
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.006)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw star particles
      particles.forEach((p) => {
        ctx.fillStyle = `rgba(0, 194, 255, ${p.opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Update positions
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += (Math.random() - 0.5) * 0.05;
        p.opacity = Math.max(0.1, Math.min(0.8, p.opacity));

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Scroll tracking to scale/pulse core orb dynamically
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 22 });

  // Core orb scaling and text rotation transformations
  const orbScale = useTransform(smoothScroll, [0, 0.5, 1], [0.8, 1.25, 0.8]);
  const rotateXSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [4, 0, 0, -4]);
  const translateYSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [20, 0, 0, -20]);
  const opacitySection = useTransform(smoothScroll, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Orb offset mapping based on mouse position
  const orbX = useSpring(isHovered ? (mousePosition.x - (containerRef.current?.offsetWidth || 0) / 2) * 0.05 : 0);
  const orbY = useSpring(isHovered ? (mousePosition.y - (containerRef.current?.offsetHeight || 0) / 2) * 0.05 : 0);

  return (
    <Section 
      id="vision" 
      glowVariant="orbs" 
      className="!py-16 md:!py-24 border-t border-white/[0.08] bg-[#0A0A0B] relative overflow-hidden"
    >
      <div 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="absolute inset-0 w-full h-full z-0"
      >
        {/* Interactive canvas starfield particles */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />
        
        {/* Immersive digital background orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,194,255,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10" style={{ perspective: 1200 }}>
        <motion.div 
          style={{ rotateX: rotateXSection, y: translateYSection, opacity: opacitySection, transformStyle: "preserve-3d" }}
          className="relative z-10 flex flex-col items-center justify-center text-center space-y-10"
        >
          
          {/* Status Capsule */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="badge shadow-[0_0_20px_rgba(0,194,255,0.08)] bg-white/[0.02] border border-white/[0.08] text-[10px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-1.5 px-4 py-2 rounded-full z-20"
          >
            <Globe size={14} className="text-brand-primary animate-spin" /> Operational Horizon
          </motion.div>

          {/* Immersive Pulsing Core Orb */}
          <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center z-10">
            <motion.div
              style={{
                scale: orbScale,
                x: orbX,
                y: orbY,
                background: "radial-gradient(circle, rgba(0,194,255,0.06) 0%, transparent 70%)",
                border: "1px solid rgba(0,194,255,0.18)",
              }}
              className="absolute w-56 h-56 lg:w-72 lg:h-72 rounded-full pointer-events-none"
              animate={{
                boxShadow: isHovered 
                  ? [
                      "0 0 50px rgba(0, 194, 255, 0.15), inset 0 0 40px rgba(0, 194, 255, 0.1)",
                      "0 0 70px rgba(0, 194, 255, 0.28), inset 0 0 50px rgba(0, 194, 255, 0.15)",
                      "0 0 50px rgba(0, 194, 255, 0.15), inset 0 0 40px rgba(0, 194, 255, 0.1)"
                    ]
                  : [
                      "0 0 40px rgba(0, 194, 255, 0.08), inset 0 0 30px rgba(0, 194, 255, 0.05)",
                      "0 0 55px rgba(0, 194, 255, 0.18), inset 0 0 40px rgba(0, 194, 255, 0.1)",
                      "0 0 40px rgba(0, 194, 255, 0.08), inset 0 0 30px rgba(0, 194, 255, 0.05)"
                    ]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Spinning inner geometric telemetry overlay */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-44 h-44 rounded-full border border-dashed border-white/[0.04]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-36 h-36 rounded-full border border-dashed border-brand-primary/10"
            />
          </div>

          {/* Kinetic Editorial Typography */}
          <div className="max-w-4xl relative z-20 space-y-8">
            <h3 
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              We inject code logic <br />
              into physical <span className="text-brand-primary font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.28)' }}>blueprints.</span>
            </h3>
            
            <p className="text-white/40 text-base md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              We build systems where code meets the physical world — fast, modular, and always evolving.
            </p>
          </div>

        </motion.div>
      </div>
    </Section>
  );
};
export default VisionFutureSection;
