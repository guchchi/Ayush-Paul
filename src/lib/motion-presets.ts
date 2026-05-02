/**
 * GLOBAL MOTION TOKENS
 * Philosophy: Subtle Premium
 * Easing: Natural Cinematic (Apple/Vercel style)
 */

export const EASING = {
  // Ultra smooth, slightly weighted for premium feel
  PREMIUM: [0.22, 1, 0.36, 1] as any, 
  // Fast and sharp for quick interactions
  INTERACTIVE: [0.4, 0, 0.2, 1] as any,
  // Smoothly accelerates and decelerates
  CHOREOGRAPHY: [0.65, 0, 0.35, 1] as any,
  // Standard spring for magnetic/bounce effects
  SPRING: { type: "spring", stiffness: 100, damping: 20, mass: 1 } as any
};

export const DURATION = {
  INSTANT: 0.1,
  FAST: 0.3,
  NORMAL: 0.5,
  PREMIUM: 0.8,
  CHOREOGRAPHY: 1.2
};

export const VARIANTS = {
  fadeUp: {
    initial: { opacity: 0, y: 30, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: DURATION.PREMIUM, ease: EASING.PREMIUM }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM }
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM }
  },
  lift: {
    whileHover: { y: -8, scale: 1.01 },
    transition: { duration: DURATION.FAST, ease: EASING.PREMIUM }
  }
};
