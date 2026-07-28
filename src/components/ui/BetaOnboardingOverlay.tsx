import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { EASING, DURATION } from '../../lib/motion-presets';

const STORAGE_KEY = 'blueprint-beta-onboarding-v1';

export function BetaOnboardingOverlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on workspace routes
    if (!location.pathname.startsWith('/workspace')) return;

    try {
      const hasSeen = localStorage.getItem(STORAGE_KEY);
      if (!hasSeen) {
        setIsVisible(true);
        console.log('[Analytics] beta_onboarding_viewed');
      }
    } catch (e) {
      console.error('Failed to read from localStorage', e);
    }
  }, [location.pathname]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
    setIsVisible(false);
  };

  const handleStartModule1 = () => {
    console.log('[Analytics] beta_onboarding_started');
    handleDismiss();
    navigate('/workspace/client-acquisition');
  };

  const handleExploreBeta = () => {
    console.log('[Analytics] beta_onboarding_dismissed');
    handleDismiss();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030712]/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
          className="relative w-full max-w-lg bg-[#0a0a0a] rounded-xl border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8"
        >
          {/* Subtle Glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#0058be]/50 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#0058be]/10 blur-[60px] pointer-events-none" />

          {/* Header/Badge */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2 text-[#0058be]">
              <Sparkles size={16} />
              <span className="text-xs font-semibold tracking-wide uppercase">Blueprint OS Beta v0.3</span>
            </div>
            <span className="text-xs font-medium text-white/50">3/7 Ready</span>
          </div>

          <div className="mb-6 text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-white/95 tracking-tight mb-2">
              Welcome 👋
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-[90%]">
              Complete the first three modules to build the foundation of your consulting business.
            </p>
          </div>

          {/* Module Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Module 1</div>
              <div className="text-sm font-medium text-white/90">Opportunity</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Module 2</div>
              <div className="text-sm font-medium text-white/90">Offer</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Module 3</div>
              <div className="text-sm font-medium text-white/90">Authority</div>
            </div>
          </div>

          {/* Availability note */}
          <div className="text-xs text-white/40 mb-6">
            Available in Beta: 3 of 7 modules
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              onClick={handleExploreBeta}
              className="px-4 py-2 rounded-lg border border-white/10 bg-transparent hover:bg-white/5 text-white/70 text-sm font-medium transition-colors cursor-pointer"
            >
              Explore Beta
            </button>
            <button
              onClick={handleStartModule1}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#0058be] hover:bg-[#0058be]/90 text-white text-sm font-medium transition-colors shadow-[0_0_15px_rgba(0,88,190,0.3)] cursor-pointer"
            >
              Start Module 1
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
