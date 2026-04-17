import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { X } from "lucide-react";

export const CancelPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A0A0A]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
          <X size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Payment Cancelled</h1>
          <p className="text-white/40 text-lg">No worries! You can always support later.</p>
        </div>
        <button 
          onClick={() => navigate("/")}
          className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
        >
          Back to Portfolio
        </button>
      </motion.div>
    </div>
  );
};


