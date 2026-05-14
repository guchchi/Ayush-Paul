import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useAnalytics } from '../hooks/useAnalytics';

export const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useSEO({
    title: "Payment Successful | Ayush Paul Lab",
    description: "Thank you for your purchase.",
    noindex: true
  });

  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (sessionId) {
      trackEvent('purchase_success', { session_id: sessionId });
    }
  }, [sessionId, trackEvent]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.2)]"
      >
        <CheckCircle size={48} className="text-green-500" />
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
        Payment Successful!
      </h1>
      
      <p className="text-lg text-white/60 mb-12 max-w-md">
        Thank you for supporting the Innovation Lab. Your premium blueprint has been unlocked and is waiting for you in your digital vault.
      </p>

      <button 
        onClick={() => navigate('/lab/dashboard')}
        className="px-8 py-4 rounded-full bg-brand-primary text-black font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-xl shadow-brand-primary/20"
      >
        Go to My Lab <ArrowRight size={18} />
      </button>
    </motion.div>
  );
};
