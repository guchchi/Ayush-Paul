import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Coffee, Sparkles, X, AlertCircle, Loader2 } from 'lucide-react';

export const SupportModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tiers = [
    { id: 1, name: "Supporter", price: 99, icon: <Heart size={24} />, desc: "A small token of appreciation" },
    { id: 2, name: "Coffee Support", price: 299, icon: <Coffee size={24} />, desc: "Keep the code flowing with caffeine" },
    { id: 3, name: "Premium Supporter", price: 999, icon: <Sparkles size={24} />, desc: "Ultimate support for my journey" },
  ];

  const handleSupport = async (tier: typeof tiers[0]) => {
    setLoading(tier.id);
    setError(null);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: tier.price, tierName: tier.name }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      console.error("Payment Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass-card rounded-[40px] border border-white/10 overflow-hidden"
          >
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Support My Work</h2>
                <p className="text-white/40 text-sm mt-1">Choose a tier to support my projects</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-4">
              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  disabled={loading !== null}
                  onClick={() => handleSupport(tier)}
                  className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-primary/50 hover:bg-white/10 transition-all flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                      {tier.icon}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{tier.name}</div>
                      <div className="text-sm text-white/40">{tier.desc}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-brand-primary">₹{tier.price}</div>
                    {loading === tier.id ? (
                      <Loader2 size={16} className="animate-spin ml-auto mt-1" />
                    ) : (
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">One-time</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-8 bg-white/5 border-t border-white/10 text-center">
              <p className="text-xs text-white/20 font-medium">
                Secure payment powered by <span className="text-white/40">Stripe</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const SupportButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-primary/30 transition-all group"
      >
        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
          <Heart size={16} fill="currentColor" />
        </div>
        <span className="text-sm font-bold">Support My Work</span>
      </button>
      <SupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
