import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';
import { KingdomCarousel } from '../components/kingdom/KingdomCarousel';

export const HomePage = ({ onViewPortfolio }: { onViewPortfolio?: () => void }) => {
  useSEO({
    title: "Ayush Paul | System Architect & Innovator",
    description: "Enter the Digital Kingdom of Ayush Paul. An ecosystem of AI, Robotics, Electronics, and Creative Media.",
    keywords: "Ayush Paul, System Architect, Digital Kingdom, Builder, Future Founder",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Ayush Paul Kingdom",
      "url": getCanonicalUrl(),
    }
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-screen bg-[#050505] overflow-hidden flex flex-col"
    >
      {/* Ambient Background Effects */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-50 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
        }}
      >
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-accent/10 blur-[150px]" />
      </div>

      {/* Cinematic Hero */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 backdrop-blur-md"
          >
            Digital Identity System v3.0
          </motion.div>
          
          <h1 className="text-[clamp(3rem,8vw,7rem)] font-extrabold tracking-tighter leading-[1.05] text-white mb-6">
            Engineering the Next Era<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
              of Intelligence.
            </span>
          </h1>
          
          <p className="text-xl md:text-3xl text-white/40 font-medium max-w-2xl leading-relaxed tracking-tight">
            Through Code & Silicon.
          </p>
        </motion.div>
      </div>

      {/* Kingdom Gateway Carousel */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="w-full z-10 pb-12"
      >
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
        <KingdomCarousel />
      </motion.div>
    </motion.div>
  );
};
