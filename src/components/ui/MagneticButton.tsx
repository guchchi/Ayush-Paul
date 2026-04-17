import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { EASING } from "../../lib/motion-presets";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export const MagneticButton = ({ children, className, onClick, strength = 0.4 }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    // Weighted inertia
    setPosition({ x: x * strength, y: y * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ 
        x: position.x, 
        y: position.y,
        scale: position.x !== 0 ? 1.02 : 1
      }}
      transition={{ 
        type: "spring", 
        stiffness: 120, 
        damping: 15, 
        mass: 0.8, // Weighted feel
        scale: { duration: 0.3, ease: EASING.PREMIUM }
      }}
      className={className}
      style={{ willChange: "transform" }}
    >
      <button onClick={onClick} className="w-full h-full cursor-pointer focus:outline-none">
        {children}
      </button>
    </motion.div>
  );
};
