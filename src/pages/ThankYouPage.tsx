import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Heart, ArrowRight, Twitter, Linkedin, Coffee, Zap, Rocket } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';
import { MagneticButton } from '../components/ui/MagneticButton';

const DONATION_TIERS = [
  { amount: 1, label: "Buy me a coffee", icon: Coffee },
  { amount: 5, label: "Support the research", icon: Zap },
  { amount: 10, label: "Fuel the next robot", icon: Heart },
];

export const ThankYouPage = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  useSEO({
    title: "Thank You! | Ayush Paul Lab",
    description: "Your download is starting. Thank you for supporting innovation.",
    url: getCanonicalUrl("/thank-you")
  });

  const handleDonation = async () => {
    if (!selectedTier) return;
    
    try {
      const response = await fetch('/api/create-donation-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: selectedTier,
          userId: 'anonymous'
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Donation system temporarily unavailable. Please try again later.");
      }
    } catch (e) {
      console.error("Donation redirect failed:", e);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bg-primary pt-24 pb-24 px-6 flex flex-col items-center justify-center text-center"
    >
      <div className="max-w-2xl w-full mx-auto">
        
        {/* Success Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-24 h-24 rounded-full bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center mx-auto mb-8 shadow-sm text-[#0058be]"
        >
          <CheckCircle size={44} />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 leading-none text-[#0b1c30]">
          Your innovation is on its way.
        </h1>
        
        <p className="text-base md:text-lg text-[#424754] mb-12 font-semibold">
          The download should have started automatically. If not, check your browser's download manager. Thank you for being part of this ecosystem!
        </p>

        {/* Donation & Support Panel */}
        <div className="p-8 md:p-12 rounded-[32px] bg-white border border-[#c2c6d6]/35 relative overflow-hidden mb-12 shadow-sm text-left">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0058be]" />
          
          <div className="flex flex-col items-center text-center mb-8">
            <Heart size={32} className="text-[#0058be] mb-4" />
            <h2 className="text-2xl font-extrabold mb-2 text-[#0b1c30]">Support Open Innovation</h2>
            <p className="text-[#424754]/60 text-xs max-w-md font-semibold">
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
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-[#0058be] bg-[#eff4ff] text-[#0058be] shadow-sm scale-105' 
                      : 'border-[#c2c6d6]/30 bg-bg-secondary text-[#424754]/60 hover:bg-[#eff4ff]/50 hover:border-[#adc6ff]'
                  }`}
                >
                  <Icon size={24} className={isSelected ? 'text-[#0058be]' : 'text-[#424754]/60'} />
                  <span className="text-2xl font-extrabold text-[#0b1c30] mt-2 mb-1">${tier.amount}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#424754]/60">{tier.label}</span>
                </button>
              );
            })}
          </div>

          {selectedTier && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <MagneticButton>
                <button
                  onClick={handleDonation}
                  className="px-8 py-4 rounded-full bg-[#0b1c30] hover:bg-[#0058be] text-white font-bold flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-sm text-xs uppercase tracking-wider"
                >
                  Donate ${selectedTier} Securely <ArrowRight size={14} />
                </button>
              </MagneticButton>
            </motion.div>
          )}
        </div>

        {/* Share Protocol Hook */}
        <div className="mb-16">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#424754]/40 mb-6">Share Blueprint</div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just unlocked a new engineering blueprint from @paulayush's Lab. Time to build. 🚀\n\nCheck it out here: ${getCanonicalUrl('/blueprints')}`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-white border border-[#c2c6d6]/35 hover:bg-[#1DA1F2]/5 hover:border-[#1DA1F2]/20 hover:text-[#1DA1F2] text-[#424754] font-bold text-sm shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <Twitter size={18} className="text-[#1DA1F2]" />
              <span>Share on X</span>
            </a>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getCanonicalUrl('/blueprints'))}`}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-white border border-[#c2c6d6]/35 hover:bg-[#0077B5]/5 hover:border-[#0077B5]/20 hover:text-[#0077B5] text-[#424754] font-bold text-sm shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <Linkedin size={18} className="text-[#0077B5]" />
              <span>Share on LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Next Steps / Community */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/blueprints')}
            className="p-8 rounded-[32px] border border-[#c2c6d6]/30 bg-white hover:bg-[#eff4ff]/40 hover:border-[#0058be]/20 transition-all flex flex-col items-center text-center group cursor-pointer shadow-sm"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0058be] mb-2 flex items-center gap-2">
              <Zap size={12} /> Explore Lab
            </span>
            <span className="text-lg font-extrabold text-[#0b1c30] group-hover:text-[#0058be] transition-colors leading-none tracking-tight">Return to Workspace</span>
          </button>
          
          <Link 
            to="/building"
            className="p-8 rounded-[32px] border border-[#dce9ff] bg-[#eff4ff]/40 hover:bg-[#eff4ff]/70 hover:border-[#0058be]/20 transition-all flex flex-col items-center text-center group shadow-sm"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0058be] mb-2 flex items-center gap-2">
              <Rocket size={12} /> Momentum
            </span>
            <span className="text-lg font-extrabold text-[#0b1c30] group-hover:text-[#0058be] transition-colors leading-none tracking-tight">See what's being built</span>
          </Link>
        </div>

      </div>
    </motion.div>
  );
};

export default ThankYouPage;
