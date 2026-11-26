import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, Settings, ShieldCheck, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  essential: boolean;
}

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    analytics: true,
    marketing: false,
    functional: true,
    essential: true
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (preferences: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setIsVisible(false);
    setShowPreferences(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: preferences }));
  };

  const handleAcceptAll = () => {
    const allOn = { analytics: true, marketing: true, functional: true, essential: true };
    saveConsent(allOn);
  };

  const handleRejectAll = () => {
    const onlyEssential = { analytics: false, marketing: false, functional: false, essential: true };
    saveConsent(onlyEssential);
  };

  const togglePref = (key: keyof CookiePreferences) => {
    if (key === 'essential') return;
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && !showPreferences && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 pointer-events-none"
          >
            <div className="max-w-6xl mx-auto pointer-events-auto">
              <div className="glass bg-[#0F0F0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-full p-4 md:px-8 md:py-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-brand-primary/5 blur-3xl -translate-x-1/2 pointer-events-none" />
                
                <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-brand-primary/10 items-center justify-center text-brand-primary shrink-0">
                    <Cookie size={20} />
                  </div>
                  <p className="text-white/70 text-sm font-medium leading-tight max-w-md">
                    We use cookies to improve experience and show relevant ads. 
                    <a href="/privacy" className="text-brand-primary hover:underline ml-1">Learn more</a>
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
                  >
                    <Settings size={12} /> Preferences
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 md:flex-none px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 font-bold text-[11px] uppercase tracking-widest transition-all"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 md:flex-none px-8 py-2.5 bg-brand-primary text-black rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-white active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreferences(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <ShieldCheck size={20} />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">Cookie Settings</h3>
                  </div>
                  <button onClick={() => setShowPreferences(false)} className="text-white/20 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'essential', title: 'Essential Cookies', desc: 'Required for core functionality. Cannot be disabled.', required: true },
                    { id: 'functional', title: 'Functional Cookies', desc: 'Used for personalization and user preferences.', required: false },
                    { id: 'analytics', title: 'Analytics Cookies', desc: 'Help us understand how you use the site.', required: false },
                    { id: 'marketing', title: 'Marketing Cookies', desc: 'Used to deliver relevant advertisements.', required: false }
                  ].map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => togglePref(item.id as keyof CookiePreferences)}
                      className={cn(
                        "p-5 rounded-2xl border transition-all cursor-pointer group",
                        item.required ? "border-white/5 bg-white/[0.02]" : 
                        "border-white/10 hover:border-brand-primary/30 hover:bg-brand-primary/[0.02]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-white/40">{item.desc}</p>
                        </div>
                        <div className={cn(
                          "w-10 h-5 rounded-full relative transition-colors",
                          item.required || prefs[item.id as keyof CookiePreferences] ? "bg-brand-primary" : "bg-white/10"
                        )}>
                          <div className={cn(
                            "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                            item.required || prefs[item.id as keyof CookiePreferences] ? "right-1" : "left-1"
                          )} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button 
                    onClick={() => setShowPreferences(false)}
                    className="w-full py-4 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => saveConsent(prefs)}
                    className="w-full py-4 rounded-2xl bg-brand-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-brand-primary/10 flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Save Preferences
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
