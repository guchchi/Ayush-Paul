import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';

// ============================================================================
// CONFIGURATION: Cloudinary Looping Video Source
// ============================================================================
export const CHARACTER_VIDEO_URL = "https://res.cloudinary.com/da4ftlm9x/video/upload/v1780040958/Futuristic_robot_looping_backgro__202605291319_qyr6ao.mp4"; 

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Set up dynamic scroll tracking for immersive cinematic transitions
  const { scrollY } = useScroll();

  // Scroll animations (0 to 700px scroll window):
  // 1. Video scales down slightly (zooms out) and fades out to blend into dark backgrounds
  const videoScale = useTransform(scrollY, [0, 700], [1.06, 0.96]);
  const videoOpacity = useTransform(scrollY, [0, 700], [1.0, 0.0]);

  // 2. Parallax translate of typography and CTA (float upward and fade cleanly)
  const contentY = useTransform(scrollY, [0, 700], [0, -75]);
  const contentOpacity = useTransform(scrollY, [0, 700], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 700], [1, 0.93]);

  // 3. Darkening mask dynamically blends the Hero card into the subsequent dark page section
  const maskOpacity = useTransform(scrollY, [0, 700], [0.0, 1.0]);

  // Inject Google Fonts dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <section 
      id="home"
      ref={containerRef}
      className="relative w-full min-h-[100svh] lg:h-[100svh] overflow-hidden bg-[#0A0A0B] text-white flex flex-col justify-between px-4 pt-4 pb-4 sm:px-8 sm:pt-6 sm:pb-6 md:px-12 md:pt-8 md:pb-8 select-none z-10"
    >
      {/* ----------------- LAYER 1: VIDEO BACKGROUND WITH PARALLAX SCROLL ----------------- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#0A0A0B]">
        <motion.video
          style={{ scale: videoScale, opacity: videoOpacity }}
          src={CHARACTER_VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-[1.18] contrast-[1.12] saturate-[1.25]"
        />

        {/* Cinematic high-fidelity film grain noise overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-1 opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
          }}
        />
        
        {/* Subtle dot matrix overlay to preserve the technical/industrial texture, reduced opacity for sharpness */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay z-1"
          style={{
            backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Futuristic Ambient Blue & Purple Glow behind the text to enhance legibility naturally without dark masks */}
        <div 
          className="absolute left-[-10%] top-[10%] w-[65%] h-[80%] rounded-full pointer-events-none z-5 opacity-[0.45] blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(0, 194, 255, 0.18) 0%, rgba(123, 97, 255, 0.08) 50%, transparent 100%)'
          }}
        />

        {/* Deep cosmic indigo background ambient wash */}
        <div 
          className="absolute left-[30%] top-[-10%] w-[70%] h-[60%] rounded-full pointer-events-none z-1 opacity-[0.35] blur-[160px]"
          style={{
            background: 'radial-gradient(circle, rgba(123, 97, 255, 0.06) 0%, transparent 70%)'
          }}
        />

        {/* Luxury-tech Anamorphic warm flare at the bottom right */}
        <div 
          className="absolute right-[-5%] bottom-[10%] w-[50%] h-[50%] rounded-full pointer-events-none z-5 opacity-[0.25] blur-[150px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 230, 200, 0.08) 0%, rgba(0, 194, 255, 0.03) 60%, transparent 100%)'
          }}
        />

        {/* Sleek, ultra-subtle dual-gradient overlay for light text/navbar legibility while keeping the video extremely bright */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to right, rgba(10, 10, 11, 0.35) 0%, rgba(10, 10, 11, 0.15) 35%, rgba(10, 10, 11, 0) 70%), linear-gradient(to bottom, rgba(10, 10, 11, 0.25) 0%, rgba(10, 10, 11, 0) 15%)'
          }}
        />

        {/* Dynamic Darkening Mask that smooth-scrolls into solid theme base color */}
        <motion.div 
          style={{ opacity: maskOpacity }}
          className="absolute inset-0 pointer-events-none z-10 bg-[#0A0A0B]"
        />

        {/* Cinematic vertical gradient mask transitioning into page content */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-15 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent"
        />

        {/* Glowing horizon line blending the two sections */}
        <div 
          className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#00C2FF]/10 to-transparent pointer-events-none z-15 blur-[1px]"
        />
      </div>

      {/* Spacer to push content down to accommodate Navbar height */}
      <div className="h-2 sm:h-6 md:h-12 shrink-0" />

      {/* ----------------- LAYER 2: HERO TEXT & ACTIONS GRID (LEFT-ALIGNED) ----------------- */}
      <motion.div 
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        className="relative z-20 flex-grow flex flex-col justify-center max-w-7xl mx-auto w-full px-4 md:px-8 pointer-events-none"
      >
        {/* Pre-headline (Operational Indicator in Cyan) */}
        <div className="flex items-center gap-3 text-[#00C2FF] text-[10px] sm:text-xs font-mono tracking-[0.35em] mb-4 select-none drop-shadow-[0_0_10px_rgba(0,194,255,0.3)]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00C2FF] animate-pulse" />
          <span>FOUNDER-LED INNOVATION ECOSYSTEM • OPEN bluepRINts</span>
        </div>

        {/* Stacked Massive Hollow Headings in White with sharp high-contrast drop shadow */}
        <h1 
          className="font-black leading-[0.9] text-left select-none uppercase tracking-tighter flex flex-col gap-1 drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]"
          style={{ 
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(2.5rem, 6.8vw, 5.5rem)'
          }}
        >
          <span className="text-outline text-white tracking-tight">ROBOTICS.</span>
          <span className="text-outline text-white tracking-tight">SOFTWARE.</span>
          <span className="text-white drop-shadow-[0_0_35px_rgba(0,194,255,0.25)]">ECOSYSTEM.</span>
        </h1>

        <p className="text-white/70 max-w-xl text-left mt-6 sm:mt-8 text-sm sm:text-base md:text-lg leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          A founder-led engineering platform bridging physical robotics, software infrastructure, and open knowledge. Built for students to learn, developers to co-build, and sponsors to accelerate live outcomes.
        </p>

        {/* Compact Proof Strip */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 items-center justify-start mt-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50 border-l border-brand-primary/40 pl-4 py-1">
          <div className="flex items-center gap-2">
            <span className="text-brand-primary font-black">3</span> Shipped Systems
          </div>
          <span className="text-white/10 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="text-brand-primary font-black">500+</span> Accelerated Builders
          </div>
          <span className="text-white/10 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="text-brand-primary font-black">DST</span> National Award
          </div>
        </div>

        {/* Action Elements Deck */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6 pointer-events-auto">
          <a
            href="#ecosystem-access"
            className="relative group overflow-hidden px-8 py-3.5 rounded-full bg-white/5 border border-white/10 hover:border-[#00C2FF]/40 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:shadow-[0_0_35px_rgba(0,194,255,0.25)] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
          >
            {/* Background gradient shine on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00C2FF]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {/* Active glow core */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00C2FF]/0 via-[#00C2FF]/30 to-[#7B61FF]/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
            
            <span className="relative z-10 text-white group-hover:text-[#00C2FF] transition-colors duration-300">Choose Your Pathway</span>
          </a>

          <Link
            to="/systems"
            className="group text-white/50 hover:text-white font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] transition-all duration-300 flex items-center gap-2 py-2"
          >
            Explore Open Blueprints
            <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </Link>
        </div>
      </motion.div>

      {/* ----------------- LAYER 3: ECOSYSTEM TELEMETRY PANEL ----------------- */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 border-t border-white/[0.08] pt-6 pb-6 md:pt-8 md:pb-8 mt-6 sm:mt-10 md:mt-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-left">
          {/* Pillar 1: ROBOTICS & EMBEDDED */}
          <div className="flex flex-col space-y-2 group">
            <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 transition-colors">
              <span>[ 01 / ROBOTICS ]</span>
              <span className="flex items-center gap-1.5 text-[#00C2FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C2FF] animate-pulse" />
                ACTIVE DEPLOYMENTS
              </span>
            </div>
            <h4 className="text-sm font-bold tracking-tight text-white/90">Robotics & Embedded Systems</h4>
            <p className="text-white/40 text-[11px] sm:text-xs leading-relaxed max-w-xs">
              Engineering autonomous closed-loop physical systems, modular chassis, and ESP32 control networks.
            </p>
          </div>

          {/* Pillar 2: SOFTWARE INFRASTRUCTURE */}
          <div className="flex flex-col space-y-2 border-t md:border-t-0 md:border-l border-white/[0.08] pt-6 md:pt-0 md:pl-8 lg:pl-12 group">
            <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 transition-colors">
              <span>[ 02 / SOFTWARE ]</span>
              <span className="flex items-center gap-1.5 text-[#7B61FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B61FF]" />
                SHIPPED TO PRODUCTION
              </span>
            </div>
            <h4 className="text-sm font-bold tracking-tight text-white/90">Software Infrastructure</h4>
            <p className="text-white/40 text-[11px] sm:text-xs leading-relaxed max-w-xs">
              Full-stack platforms, telemetry dashboards, and AI agent systems designed for real scale.
            </p>
          </div>

          {/* Pillar 3: KNOWLEDGE BLUEPRINTS */}
          <div className="flex flex-col space-y-2 border-t md:border-t-0 md:border-l border-white/[0.08] pt-6 md:pt-0 md:pl-8 lg:pl-12 group">
            <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 transition-colors">
              <span>[ 03 / BLUEPRINTS ]</span>
              <span className="flex items-center gap-1.5 text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                ACCELERATING LEARNERS
              </span>
            </div>
            <h4 className="text-sm font-bold tracking-tight text-white/90">Open Knowledge Blueprints</h4>
            <p className="text-white/40 text-[11px] sm:text-xs leading-relaxed max-w-xs">
              Publishing schematics, closed-loop PID parameters, and detailed build chronicles transparently.
            </p>
          </div>
        </div>
      </motion.div>

    </section>
  );
};

export default HeroSection;
