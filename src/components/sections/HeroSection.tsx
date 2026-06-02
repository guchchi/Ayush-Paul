import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { useScrollToSection } from "@/src/hooks/useScrollToSection";
import { Button } from '../ui/button';
import { ArrowRight, Terminal } from 'lucide-react';

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollToSection } = useScrollToSection();
  const { scrollY } = useScroll();

  // Scroll animations:
  const heroOpacity = useTransform(scrollY, [0, 600], [1.0, 0.0]);
  const heroScale = useTransform(scrollY, [0, 600], [1.0, 0.95]);
  const heroY = useTransform(scrollY, [0, 600], [0, -40]);

  // System Matrix Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Resize Handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Systems Node Setup
    const labels = ["Idea", "AI Agent", "Next.js Core", "SEO Engine", "Automation Flow", "Production Deploy"];
    const nodes = labels.map((label, i) => {
      const angle = (i / labels.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.28;
      return {
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        baseX: width / 2 + Math.cos(angle) * radius,
        baseY: height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 4,
        label,
        glowPulse: Math.random() * Math.PI
      };
    });

    // Data packet transmission animation
    const packets: Array<{
      from: number;
      to: number;
      progress: number;
      speed: number;
    }> = [];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
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

      // 2. Draw connections between nodes
      ctx.strokeStyle = 'rgba(0, 194, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // 3. Update & Draw Data Packets
      if (Math.random() < 0.03 && packets.length < 8) {
        const fromIdx = Math.floor(Math.random() * nodes.length);
        let toIdx = Math.floor(Math.random() * nodes.length);
        while (toIdx === fromIdx) {
          toIdx = Math.floor(Math.random() * nodes.length);
        }
        packets.push({
          from: fromIdx,
          to: toIdx,
          progress: 0,
          speed: 0.008 + Math.random() * 0.01
        });
      }

      packets.forEach((packet, pIdx) => {
        packet.progress += packet.speed;
        if (packet.progress >= 1) {
          packets.splice(pIdx, 1);
          return;
        }

        const startNode = nodes[packet.from];
        const endNode = nodes[packet.to];
        const currentX = startNode.x + (endNode.x - startNode.x) * packet.progress;
        const currentY = startNode.y + (endNode.y - startNode.y) * packet.progress;

        // Draw packet glow
        const glowGrad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 6);
        glowGrad.addColorStop(0, 'rgba(0, 194, 255, 0.8)');
        glowGrad.addColorStop(1, 'rgba(0, 194, 255, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Update & Draw Nodes
      nodes.forEach((node) => {
        // Subtle drift movement
        node.glowPulse += 0.02;
        node.x = node.baseX + Math.sin(node.glowPulse) * 8;
        node.y = node.baseY + Math.cos(node.glowPulse) * 8;

        // Glow ring
        const currentGlowRadius = 8 + Math.abs(Math.sin(node.glowPulse)) * 8;
        const nodeGlowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, currentGlowRadius);
        nodeGlowGrad.addColorStop(0, 'rgba(0, 194, 255, 0.15)');
        nodeGlowGrad.addColorStop(1, 'rgba(0, 194, 255, 0)');
        
        ctx.fillStyle = nodeGlowGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentGlowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node dot
        ctx.fillStyle = '#00C2FF';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y - 12);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section 
      id="home"
      ref={containerRef}
      className="relative w-full min-h-screen lg:h-screen bg-[#000000] text-white flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16 select-none z-10"
    >
      {/* 1. VISUAL SYSTEM MATRIX BACKGROUND */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#000000]">
        <canvas ref={canvasRef} className="w-full h-full opacity-60" />
        
        {/* Soft Ambient Glows */}
        <div 
          className="absolute left-[-10%] top-[10%] w-[65%] h-[80%] rounded-full pointer-events-none z-5 opacity-[0.25] blur-[150px]"
          style={{
            background: 'radial-gradient(circle, rgba(0, 194, 255, 0.08) 0%, transparent 100%)'
          }}
        />
        
        {/* Sleek Gradient Overlay for Content Contrast */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.6) 100%)'
          }}
        />
      </div>

      {/* 2. TYPOGRAPHY AND ACTIONS CONTAINER */}
      <motion.div 
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative z-20 max-w-7xl mx-auto w-full px-4 md:px-8 flex flex-col justify-center pointer-events-none"
      >
        {/* Pre-headline (Indicator badge) */}
        <div className="flex items-center gap-3 text-brand-primary text-xs font-bold uppercase tracking-[0.25em] mb-6 select-none">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00C2FF] animate-pulse" />
          <span>BUILDER • DEVELOPER • EDUCATOR</span>
        </div>

        {/* Stacked Massive Headline */}
        <h1 
          className="font-black leading-[0.95] text-left select-none uppercase tracking-tighter flex flex-col gap-1 text-white"
          style={{ 
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(2.8rem, 7.5vw, 6.2rem)'
          }}
        >
          <span>TURN IDEAS INTO</span>
          <span className="text-[#00C2FF]">DIGITAL SYSTEMS</span>
        </h1>

        <p className="text-white/60 max-w-2xl text-left mt-6 sm:mt-8 text-base sm:text-lg md:text-xl leading-relaxed font-medium">
          I document, build, and share frameworks for launching websites, products, automations, and AI-powered workflows.
        </p>

        {/* CTAs Deck */}
        <div className="mt-10 flex flex-wrap items-center gap-5 pointer-events-auto">
          <Button
            asChild
            variant="primary"
            size="lg"
            className="relative group cursor-pointer"
          >
            <a
              href="#access"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('access');
              }}
            >
              Explore Blueprints
            </a>
          </Button>

          <Link
            to="/blog"
            className="group text-white/50 hover:text-white font-mono text-xs uppercase tracking-[0.25em] transition-all duration-300 flex items-center gap-2 py-2"
          >
            Read the Blog
            <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
