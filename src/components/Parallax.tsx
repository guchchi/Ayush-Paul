import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { cn } from '../lib/utils';

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const ParallaxContext = React.createContext<{ scrollYProgress: MotionValue<number> | null }>({ scrollYProgress: null });

/**
 * A container that tracks scroll progress and passes it down to ParallaxLayers.
 * Acts as the reference window for child animations.
 */
export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({ children, className, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track the scroll progress within this specific container
  // "start end" = top of target hits bottom of viewport
  // "end start" = bottom of target hits top of viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <ParallaxContext.Provider value={{ scrollYProgress }}>
      <section 
        id={id}
        ref={containerRef} 
        className={cn("relative overflow-hidden w-full", className)}
      >
        {children}
      </section>
    </ParallaxContext.Provider>
  );
};

interface ParallaxLayerProps {
  children: React.ReactNode;
  offset?: number; 
  className?: string;
  zIndex?: number;
}

/**
 * A layer that moves at a different speed than the normal scroll.
 * Must be a descendant of ParallaxContainer.
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ 
  children, 
  offset = 100, 
  className,
  zIndex = 10
}) => {
  const ctx = React.useContext(ParallaxContext);
  
  if (!ctx.scrollYProgress) {
    console.warn("ParallaxLayer must be used within a ParallaxContainer");
    return <div className={className}>{children}</div>;
  }

  // Map scroll progress (0 to 1) to a Y translation pixel value.
  // Inverse scroll: when container enters from bottom (0), element is pushed down (+offset)
  // When container leaves through top (1), element is pushed up (-offset)
  const y = useTransform(ctx.scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div 
      className={cn("absolute inset-0 pointer-events-none flex items-center justify-center", className)}
      style={{ y, zIndex, willChange: "transform" }}
    >
      <div className="pointer-events-auto h-full w-full relative">
        {children}
      </div>
    </motion.div>
  );
};
