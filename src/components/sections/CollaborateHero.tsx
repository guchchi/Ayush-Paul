import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Workflow } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';
import { MagneticButton } from '../ui/MagneticButton';

interface CollaborateHeroProps {
  onStartClick: () => void;
  onExploreClick: () => void;
}

export const CollaborateHero: React.FC<CollaborateHeroProps> = ({ onStartClick, onExploreClick }) => {
  return (
    <section className="pt-24 pb-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <motion.div 
              variants={VARIANTS.fadeUp}
              initial="initial"
              animate="animate"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#0058be] shadow-sm mb-2"
            >
              <Workflow size={12} className="text-[#0058be]" />
              STUDIO
            </motion.div>
            
            <motion.h1 
              variants={VARIANTS.fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[1.05] text-[#0b1c30]"
            >
              Build Faster.<br />
              <span className="text-[#0058be]">Ship Better.</span>
            </motion.h1>

            <motion.p 
              variants={VARIANTS.fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-[#424754] font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Work directly with Ayush on websites, AI systems, automation workflows, robotics projects, and technical implementation.
            </motion.p>

            <motion.div 
              variants={VARIANTS.fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4"
            >
              <MagneticButton>
                <button 
                  onClick={onStartClick}
                  className="px-8 py-4 bg-[#0b1c30] text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 group hover:scale-105 transition-transform w-full sm:w-auto shadow-sm"
                >
                  Start a Project
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </MagneticButton>
              
              <MagneticButton>
                <button 
                  onClick={onExploreClick}
                  className="px-8 py-4 bg-white border border-[#c2c6d6]/30 text-[#0b1c30] rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
                >
                  Work With Me
                </button>
              </MagneticButton>
            </motion.div>
          </div>

          <motion.div 
            variants={VARIANTS.scaleUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
            className="flex-1 w-full relative"
          >
            <div className="aspect-square max-w-md mx-auto relative group">
              <div className="absolute inset-0 bg-[#0058be]/5 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700 -z-10" />
              <div className="relative h-full w-full bg-white rounded-[32px] border border-[#c2c6d6]/30 shadow-sm p-8 flex flex-col justify-between overflow-hidden">
                {/* Workflow Diagram Representation */}
                <div className="space-y-6">
                  {['Strategy', 'Systems', 'Execution', 'Growth'].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-[#c2c6d6]/20 flex items-center justify-center text-[#424754]/40 font-bold text-sm z-10 relative shadow-sm">
                        0{i + 1}
                      </div>
                      <div className="flex-1 h-12 rounded-2xl bg-white border border-[#c2c6d6]/20 flex items-center px-4 shadow-sm">
                        <span className="font-bold text-[#0b1c30]/80 text-sm">{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Connecting lines */}
                <div className="absolute left-[3.25rem] top-12 bottom-12 w-px bg-[#c2c6d6]/20 -z-10" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
