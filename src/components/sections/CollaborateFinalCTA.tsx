import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Workflow } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';
import { Link } from 'react-router-dom';
import { MagneticButton } from '../ui/MagneticButton';

interface CollaborateFinalCTAProps {
  onStartClick: () => void;
}

export const CollaborateFinalCTA: React.FC<CollaborateFinalCTAProps> = ({ onStartClick }) => {
  return (
    <section className="py-32 bg-bg-secondary/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,88,190,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,88,190,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-8"
        >
          <Workflow size={12} className="text-[#0058be]" />
          Next Steps
        </motion.div>

        <motion.h2
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-[#0b1c30]"
        >
          Let's Build It.
        </motion.h2>

        <motion.p
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-[#424754] font-medium mb-10 max-w-2xl mx-auto"
        >
          If you have an idea, project, system, or opportunity worth exploring, let's start the conversation and see what's possible.
        </motion.p>

        <motion.div
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
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
            <Link 
              to="/blueprints"
              className="px-8 py-4 bg-white border border-[#c2c6d6]/30 text-[#0b1c30] rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
            >
              Explore Blueprints
            </Link>
          </MagneticButton>
        </motion.div>

        <motion.div
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 pt-10 border-t border-[#c2c6d6]/20"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#424754]/40">
            Learn it. Use it. Build it. Scale it.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
