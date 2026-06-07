import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { MagneticButton } from '../components/ui/MagneticButton';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 overflow-hidden relative text-[#0b1c30]">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#0058be]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#eff4ff]/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10 space-y-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          <div className="text-[12rem] md:text-[18rem] font-display font-black text-[#0b1c30]/5 leading-none select-none">
            404
          </div>
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0058be]"
          >
            <Ghost size={120} strokeWidth={1.5} className="drop-shadow-sm" />
          </motion.div>
        </motion.div>

        <div className="space-y-6">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter text-[#0b1c30]"
          >
            Lost in the <span className="text-[#0058be] italic">Void</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#424754] text-base md:text-lg font-semibold max-w-md mx-auto"
          >
            The page you are looking for has been decommissioned or moved to a different sector.
          </motion.p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <MagneticButton>
            <Link 
              to="/" 
              className="flex items-center gap-3 px-8 py-4 bg-[#0b1c30] hover:bg-[#0058be] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-sm h-12"
            >
              <Home size={14} /> Return to Base
            </Link>
          </MagneticButton>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 text-[#424754]/60 hover:text-[#0b1c30] transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft size={14} /> Go Back
          </button>
        </motion.div>
      </div>

      {/* Subtle Grid Overlay replacement with CSS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(11,28,48,0.02)_1px,transparent_0)] bg-[size:40px_40px] pointer-events-none" />
    </div>
  );
};

export default NotFoundPage;
