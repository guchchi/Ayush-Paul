import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Sparkles, Map, Rocket } from 'lucide-react';
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#030712]/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
          className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-8 sm:p-12"
        >
          {/* Subtle Glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#0058be]/50 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#0058be]/10 blur-[80px] pointer-events-none" />

          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0058be]/10 border border-[#0058be]/20">
              <Sparkles size={14} className="text-[#0058be]" />
              <span className="text-xs font-semibold tracking-wide text-[#0058be] uppercase">
                Blueprint OS Beta <span className="opacity-50 mx-1">|</span> Version 0.3 <span className="opacity-50 mx-1">|</span> Modules Available 3 / 7
              </span>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white/95 tracking-tight mb-4">
              Welcome to the Future of Your Business
            </h1>
            <p className="text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
              You are among the first to access Blueprint OS. Build your consulting infrastructure step-by-step through our guided system.
            </p>
          </div>

          {/* Roadmap Journey */}
          <div className="relative mb-12 max-w-lg mx-auto">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/10 -translate-x-1/2" />
            
            <div className="space-y-6 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center text-zinc-400 shadow-sm z-10">
                  <Map size={14} />
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium text-white/80">
                  Welcome
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0058be] border border-[#0058be]/50 flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,88,190,0.5)] z-10">
                  <span className="text-xs font-bold">1-3</span>
                </div>
                <div className="bg-[#0058be]/10 border border-[#0058be]/20 px-4 py-2 rounded-lg text-sm font-medium text-[#0058be]">
                  Your Journey (Modules 1, 2, 3)
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center text-zinc-400 shadow-sm z-10">
                  <Rocket size={14} />
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium text-white/80">
                  Launch Your Business
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/5">
            <button
              onClick={handleExploreBeta}
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 font-medium transition-colors cursor-pointer"
            >
              Explore Beta
            </button>
            <button
              onClick={handleStartModule1}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0058be] hover:bg-[#0058be]/90 text-white font-medium transition-colors shadow-[0_0_20px_rgba(0,88,190,0.3)] hover:shadow-[0_0_30px_rgba(0,88,190,0.4)] cursor-pointer"
            >
              Start Module 1
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
