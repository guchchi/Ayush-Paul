import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { MagneticButton } from '../components/ui/MagneticButton';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10 space-y-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          <div className="text-[12rem] md:text-[18rem] font-display font-black text-white/5 leading-none select-none">
            404
          </div>
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary"
          >
            <Ghost size={120} strokeWidth={1.5} className="drop-shadow-[0_0_30px_rgba(0,194,255,0.4)]" />
          </motion.div>
        </motion.div>

        <div className="space-y-6">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white"
          >
            Lost in the <span className="text-brand-primary italic">Void</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/40 text-lg md:text-xl font-medium max-w-md mx-auto"
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
              className="flex items-center gap-3 px-10 py-5 bg-white text-black rounded-3xl font-bold text-lg hover:bg-brand-primary hover:text-white transition-all shadow-xl shadow-white/5"
            >
              <Home size={20} /> Return to Base
            </Link>
          </MagneticButton>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </motion.div>
      </div>

      {/* Subtle Grid Overlay replacement with CSS */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
    </div>
  );
};
