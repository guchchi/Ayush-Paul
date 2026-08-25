/**
 * GLOBAL MOTION TOKENS
 * Philosophy: Subtle Premium
 * Easing: Natural Cinematic (Apple/Vercel style)
 */

export const EASING = {
  // Ultra smooth, slightly weighted for premium feel (Apple / Linear style)
  PREMIUM: [0.16, 1, 0.3, 1] as const, 
  // snapping bounce for playful UI elements
  BOUNCE: [0.34, 1.56, 0.64, 1] as const,
  // Fast and sharp for quick interactions
  INTERACTIVE: [0.4, 0, 0.2, 1] as const,
  // Standard spring for magnetic Snappy premium hover effects
  SPRING_INTERACTIVE: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 } as const,
  // Smoothly accelerates and decelerates
  CHOREOGRAPHY: [0.65, 0, 0.35, 1] as const,
};

export const DURATION = {
  INSTANT: 0.1,
  FAST: 0.2,
  NORMAL: 0.4,
  SLOW: 0.8,
  CHOREOGRAPHY: 1.2
} as const;

export const VARIANTS = {
  fadeUp: {
    initial: { opacity: 0, y: 20, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: DURATION.FAST, ease: EASING.PREMIUM }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: DURATION.FAST, ease: EASING.PREMIUM }
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM }
  },
  slideInRight: {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -16 },
    transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM }
  },
  lift: {
    whileHover: { y: -4, scale: 1.005 },
    transition: { duration: DURATION.FAST, ease: EASING.PREMIUM }
  }
};
