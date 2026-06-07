import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { MagneticButton } from '../components/ui/MagneticButton';

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
      className="w-full min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 text-center text-[#0b1c30]"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-8 shadow-sm text-red-500"
      >
        <XCircle size={44} />
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 leading-none text-[#0b1c30]">
        Checkout Cancelled
      </h1>
      
      <p className="text-base text-[#424754] mb-12 max-w-md font-semibold">
        Your payment was not processed. If you had an issue during checkout, please try again or contact support.
      </p>

      <MagneticButton>
        <button 
          onClick={() => navigate('/blueprints')}
          className="px-8 py-4 rounded-full bg-[#0b1c30] hover:bg-[#0058be] text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer text-xs uppercase tracking-wider h-12"
        >
          <ArrowLeft size={14} /> Return to Lab
        </button>
      </MagneticButton>
    </motion.div>
  );
};

export default CancelPage;
