import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSafeScroll } from '../../hooks/useSafeScroll';

export const CursorFollower = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("button, a, .interactive"));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-brand-primary/50 pointer-events-none z-[9999] hidden lg:block"
      style={{ willChange: "transform" }}
      animate={{
        x: mousePos.x - 16,
        y: mousePos.y - 16,
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering ? "rgba(0, 194, 255, 0.1)" : "rgba(0, 194, 255, 0)",
      }}
      transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.2 }}
    />
  );
};
