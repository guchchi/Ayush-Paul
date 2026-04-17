import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { VARIANTS, EASING } from '../../../lib/motion-presets';

interface SectionRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  width?: "full" | "auto";
}

export const SectionReveal = ({ 
  children, 
  delay = 0, 
  width = "full",
  ...props 
}: SectionRevealProps) => {
  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-120px" }}
      transition={{ 
        ...VARIANTS.fadeUp.transition,
        delay 
      }}
      className={width === "full" ? "w-full" : "w-auto"}
      style={{ willChange: "transform, opacity, filter" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
