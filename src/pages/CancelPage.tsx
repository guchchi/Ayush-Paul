import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export const CancelPage = () => {
  const navigate = useNavigate();

  useSEO({
    title: "Payment Cancelled | Ayush Paul Lab",
    description: "Your checkout session was cancelled.",
    noindex: true
  });

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
        className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
      >
        <XCircle size={48} className="text-red-500" />
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
        Checkout Cancelled
      </h1>
      
      <p className="text-lg text-white/60 mb-12 max-w-md">
        Your payment was not processed. If you had an issue during checkout, please try again or contact support.
      </p>

      <button 
        onClick={() => navigate('/products')}
        className="px-8 py-4 rounded-full bg-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors border border-white/20"
      >
        <ArrowLeft size={18} /> Return to Lab
      </button>
    </motion.div>
  );
};
