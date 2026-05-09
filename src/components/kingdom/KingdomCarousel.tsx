import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { DOMAIN_WORLDS } from '../../lib/domain-worlds';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

export const KingdomCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth, scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleDomainClick = (id: string) => {
    // Navigate to the dynamic domain page
    navigate(`/domain/${id}`);
  };

  return (
    <div className="relative w-full py-12">
      <div className="flex justify-between items-end px-6 md:px-12 lg:px-24 mb-8">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-extrabold tracking-tighter"
          >
            How do you know me?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-sm md:text-base mt-2 font-medium"
          >
            Choose your gateway into the ecosystem.
          </motion.p>
        </div>
        <div className="hidden md:flex gap-4">
          <button onClick={() => scroll('left')} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => scroll('right')} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-12 lg:px-24 pb-16 pt-8 no-scrollbar"
      >
        {DOMAIN_WORLDS.map((domain, i) => {
          const isHovered = hoveredId === domain.id;
          
          return (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="snap-center shrink-0 w-[85vw] sm:w-[60vw] md:w-[400px] h-[500px] relative rounded-[2rem] cursor-pointer magnetic-target group"
              onClick={() => handleDomainClick(domain.id)}
              onMouseEnter={() => setHoveredId(domain.id)}
              onMouseLeave={() => setHoveredId(null)}
              layoutId={`domain-card-${domain.id}`}
            >
              {/* Card Background & Image */}
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors duration-500 z-10">
                <motion.img 
                  src={domain.image} 
                  alt={domain.title}
                  className="w-full h-full object-cover"
                  animate={{ 
                    scale: isHovered ? 1.05 : 1,
                    filter: isHovered ? 'brightness(0.8) contrast(1.1)' : 'brightness(0.6) contrast(1)'
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Custom theme glow on hover */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 100%, ${domain.themeColor}40 0%, transparent 60%)` }}
                />
              </div>

              {/* Content */}
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <motion.div
                  animate={{ y: isHovered ? -10 : 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div 
                    layoutId={`domain-tagline-${domain.id}`}
                    className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
                    style={{ color: domain.themeColor }}
                  >
                    {domain.tagline}
                  </motion.div>
                  <motion.h3 
                    layoutId={`domain-title-${domain.id}`}
                    className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4"
                  >
                    {domain.title}
                  </motion.h3>
                  
                  {/* Reveal on hover content */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <p className="text-white/60 text-sm font-medium line-clamp-2">
                      {domain.description}
                    </p>
                  </motion.div>
                </motion.div>
              </div>

              {/* External Shadow Glow */}
              <motion.div 
                className="absolute -inset-4 -z-10 rounded-[3rem] blur-2xl opacity-0 transition-opacity duration-700"
                style={{ backgroundColor: domain.themeColor }}
                animate={{ opacity: isHovered ? 0.3 : 0 }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
