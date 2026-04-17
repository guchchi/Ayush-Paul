import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

export const SuccessPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A0A0A]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mx-auto">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Payment Successful!</h1>
          <p className="text-white/40 text-lg">Thank you for supporting Ayush Paul 🚀</p>
        </div>
        <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 text-sm text-white/60 leading-relaxed">
          Your contribution helps me keep building open-source projects and creating content for the community. You're awesome!
        </div>
        <button 
          onClick={() => navigate("/")}
          className="w-full py-4 rounded-2xl bg-brand-primary text-black font-bold hover:scale-105 active:scale-95 transition-all"
        >
          Back to Portfolio
        </button>
      </motion.div>
    </div>
  );
};


