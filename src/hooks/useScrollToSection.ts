import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * useScrollToSection - Centralized scrolling authority for the portfolio.
 * Handles both in-page scrolling and cross-page anchor navigation.
 */
export const useScrollToSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = useCallback((id: string, closeMenu?: () => void) => {
    // 1. Close mobile menu immediately if callback provided
    if (closeMenu) {
      closeMenu();
    }

    // Clean the ID (remove # if present)
    const targetId = id.startsWith('#') ? id.substring(1) : id;

    // 2. Handle cross-page navigation
    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
      // The auto-scroll logic in Home.tsx will pick this up on mount
      return;
    }

    // 3. Handle same-page scrolling
    const element = document.getElementById(targetId);
    if (element) {
      // Small timeout to allow menu animation to begin or layout to settle
      setTimeout(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        
        // Update URL hash without reload for browser history consistency
        window.history.pushState(null, '', `/#${targetId}`);
      }, 100);
    } else {
      console.warn(`Target section #${targetId} not found.`);
    }
  }, [navigate, location.pathname]);

  return { scrollToSection };
};
