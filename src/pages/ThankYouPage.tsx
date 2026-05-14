import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Heart, ArrowRight, Twitter, Linkedin, Coffee } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';

const DONATION_TIERS = [
  { amount: 1, label: "Buy me a coffee", icon: Coffee },
  { amount: 5, label: "Support the research", icon: Zap },
  { amount: 10, label: "Fuel the next robot", icon: Heart },
];

// Need to import Zap for the array above
import { Zap } from 'lucide-react';

export const ThankYouPage = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  useSEO({
    title: "Thank You! | Ayush Paul Lab",
    description: "Your download is starting. Thank you for supporting innovation.",
    canonicalUrl: getCanonicalUrl("/thank-you")
  });

  const handleDonation = () => {
    if (!selectedTier) return;
    // Phase 3: Stripe Payment Link for donation
    alert(`Donation of $${selectedTier} will be processed via Stripe in Phase 3.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#0A0A0A] pt-32 pb-24 px-6 flex flex-col items-center justify-center"
    >
      <div className="max-w-2xl w-full mx-auto text-center">
        
        {/* Success Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-24 h-24 rounded-full bg-brand-primary/10 border-2 border-brand-primary/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(0,194,255,0.2)]"
        >
          <CheckCircle size={48} className="text-brand-primary" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Your innovation is on its way.
        </h1>
        
        <p className="text-lg text-white/60 mb-12">
          The download should have started automatically. If not, check your browser's download manager. Thank you for being part of this ecosystem!
        </p>

        {/* Donation & Support Panel */}
        <div className="p-8 md:p-12 rounded-[3rem] glass border border-brand-primary/20 relative overflow-hidden mb-12">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
          
          <div className="flex flex-col items-center mb-8">
            <Heart size={32} className="text-brand-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Support Open Innovation</h2>
            <p className="text-white/40 text-sm max-w-md">
              I spend hundreds of hours designing, coding, and open-sourcing these blueprints. If this helped you, consider supporting the next project!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {DONATION_TIERS.map((tier) => {
              const Icon = tier.icon;
              const isSelected = selectedTier === tier.amount;
              return (
                <button
                  key={tier.amount}
                  onClick={() => setSelectedTier(tier.amount)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-lg shadow-brand-primary/20 scale-105' 
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <Icon size={24} className="mb-2" />
                  <span className="text-2xl font-bold text-white mb-1">${tier.amount}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{tier.label}</span>
                </button>
              );
            })}
          </div>

          {selectedTier && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleDonation}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-primary text-black font-bold flex items-center justify-center gap-2 mx-auto hover:bg-white transition-colors shadow-xl shadow-brand-primary/20"
            >
              Donate ${selectedTier} Securely <ArrowRight size={18} />
            </motion.button>
          )}
        </div>

        {/* Next Steps / Community */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/products')}
            className="p-6 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-brand-primary/10 transition-colors flex flex-col items-start group"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2 flex items-center gap-2">
              <Zap size={12} /> Explore Lab
            </span>
            <span className="text-lg font-bold group-hover:text-brand-primary transition-colors">Explore More Innovations</span>
          </button>
          
          <a 
            href="https://twitter.com/paulayush" 
            target="_blank" 
            rel="noreferrer"
            className="p-6 rounded-[2rem] border border-[#1DA1F2]/20 bg-[#1DA1F2]/5 hover:bg-[#1DA1F2]/10 transition-colors flex flex-col items-start group"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1DA1F2] mb-2 flex items-center gap-2">
              <Twitter size={12} /> Community
            </span>
            <span className="text-lg font-bold group-hover:text-[#1DA1F2] transition-colors">Share what you build!</span>
          </a>
        </div>

      </div>
    </motion.div>
  );
};
