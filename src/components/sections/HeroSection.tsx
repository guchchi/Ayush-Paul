import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// ============================================================================
// CONFIGURATION: Cloudinary Looping Video Source
// ============================================================================
export const CHARACTER_VIDEO_URL = "https://res.cloudinary.com/da4ftlm9x/video/upload/v1779946330/mp__2_jtvn5w.mp4"; 

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Set up dynamic scroll tracking for immersive cinematic transitions
  const { scrollY } = useScroll();

  // Scroll animations (0 to 700px scroll window):
  // 1. Video scales down slightly (zooms out) and fades out to blend into dark backgrounds
  const videoScale = useTransform(scrollY, [0, 700], [1.06, 0.96]);
  const videoOpacity = useTransform(scrollY, [0, 700], [0.82, 0.12]);

  // 2. Parallax translate of typography and CTA (float upward and fade cleanly)
  const contentY = useTransform(scrollY, [0, 700], [0, -75]);
  const contentOpacity = useTransform(scrollY, [0, 700], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 700], [1, 0.93]);

  // 3. Darkening mask dynamically blends the Hero card into the subsequent dark page section
  const maskOpacity = useTransform(scrollY, [0, 700], [0.55, 0.98]);

  // Inject Google Fonts dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,500;1,700&family=Inter:wght@400;500;600;700;800;900&display=swap';
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
      className="relative w-full h-[100svh] overflow-hidden bg-[#0A0A0B] flex flex-col justify-between p-6 select-none"
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
          className="w-full h-full object-cover"
        />
        {/* Static vignette to hold clean edges, tuned to #0A0A0B theme */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(circle at center, rgba(10,10,11,0.08) 0%, rgba(10,10,11,0.48) 55%, rgba(10,10,11,0.96) 100%)'
          }}
        />
        {/* Dynamic Darkening Mask that smooth-scrolls into solid theme base color */}
        <motion.div 
          style={{ opacity: maskOpacity }}
          className="absolute inset-0 pointer-events-none z-10 bg-[#0A0A0B]"
        />
        {/* Soft bottom vertical gradient mask that blends perfectly into the next section's #0A0A0B background */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none z-15 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent"
        />
      </div>

      {/* Spacer to push content to middle */}
      <div className="h-10 shrink-0" />

      {/* ----------------- LAYER 2: SIMPLIFIED ATMOSPHERIC CENTRAL TYPOGRAPHY ----------------- */}
      {/* Visual noise reduction: One Headline, One Description, One Glowing CTA Button */}
      <motion.div 
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        className="relative z-20 flex-grow flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 pointer-events-none"
      >
        {/* Main Sleek Headline */}
        <h1 
          className="font-black text-white tracking-tight leading-[1.08] select-none"
          style={{ 
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(2.4rem, 6.2vw, 5.5rem)'
          }}
        >
          Intelligence that <br />
          <span 
            className="text-[#00C2FF] font-normal italic"
            style={{ 
              fontFamily: "'Playfair Display', Georgia, serif",
              textShadow: '0 0 35px rgba(0, 194, 255, 0.28)'
            }}
          >
            grows
          </span> with you.
        </h1>

        {/* Subtitle description */}
        <p className="text-white/50 max-w-xl mx-auto mt-6 text-sm sm:text-base sm:leading-relaxed font-medium leading-relaxed">
          The all-in-one platform for teams who want clarity, speed, and sustainable growth.
        </p>

        {/* Singular CTA Button */}
        <div className="mt-10 pointer-events-auto">
          <Link
            to="/contact"
            className="px-8 py-4 bg-gradient-to-r from-[#00C2FF] to-[#00E5FF] text-black font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 transform active:scale-95 flex items-center gap-2.5 shadow-[0_0_30px_rgba(0,194,255,0.32)] hover:shadow-[0_0_40px_rgba(0,194,255,0.52)] hover:scale-[1.02]"
          >
            Start Free Trial
            <ArrowRight size={16} />
          </Link>
        </div>

      </motion.div>

      {/* Elegant minimalist spacer at bottom for perfect vertical balance */}
      <div className="h-12 shrink-0" />

    </section>
  );
};

export default HeroSection;
