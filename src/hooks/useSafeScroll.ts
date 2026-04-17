import { useState, useEffect, RefObject } from 'react';
import { useScroll, ScrollOptions, useMotionValue } from 'motion/react';

/**
 * useSafeScroll - A high-reliability wrapper around Framer Motion's useScroll.
 * 
 * Enforces:
 * 1. Hydration Guard: Prevents SSR/Hydration mismatch errors.
 * 2. Ref Validation: Ensures target exists before tracking.
 * 3. Visibility Guard: Automatically falls back to global scroll if target is display:none.
 * 
 * @param targetRef Optional reference to a DOM element to track
 * @param options Framer Motion ScrollOptions
 */
export function useSafeScroll(targetRef?: RefObject<HTMLElement | null>, options: ScrollOptions = {}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [shouldTrackTarget, setShouldTrackTarget] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    const validateTarget = () => {
      if (targetRef?.current) {
        // Use getComputedStyle to check for hidden elements that would break scroll tracking
        const style = window.getComputedStyle(targetRef.current);
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
        setShouldTrackTarget(isVisible);
      } else {
        // Fall back to window scroll
        setShouldTrackTarget(false);
      }
    };

    validateTarget();

    // Re-validate if window size changes (e.g. tablet hides a desktop-only section)
    window.addEventListener('resize', validateTarget);
    return () => window.removeEventListener('resize', validateTarget);
  }, [targetRef]);

  // useScroll must be called at the top level of the hook.
  // If we are not hydrated, we pass undefined to get window scroll or safe defaults.
  // If we are hydrated and validated, we pass the target ref.
  return useScroll({
    ...options,
    target: (isHydrated && shouldTrackTarget && targetRef) ? targetRef : undefined
  });
}
