import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass, Gift, Award, Briefcase, Users, Target } from 'lucide-react';
import { EASING, DURATION } from '../../../lib/motion-presets';

export const HowItWorksSection = () => {
  const steps = [
    { icon: Compass, label: 'Choose Direction' },
    { icon: Gift, label: 'Design Offer' },
    { icon: Award, label: 'Build Authority' },
    { icon: Briefcase, label: 'Create Portfolio' },
    { icon: Users, label: 'Manage Pipeline' },
    { icon: Target, label: 'Acquire Clients' }
  ];

  return (
    <section>
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0b1c30] mb-4">How Blueprint OS Works</h2>
        <p className="text-[#424754] text-lg max-w-2xl leading-relaxed">
          A predictable, engineered system for client acquisition. No more guessing what to do next. We've broken down the exact sequence into 6 actionable steps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;
          
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: idx * 0.1 }}
              className="relative"
            >
              <div className="h-full flex flex-col p-6 rounded-2xl bg-white border border-gray-100 hover:border-[#0058be]/30 hover:shadow-md transition-all group relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#e8f2ff] rounded-full opacity-0 group-hover:opacity-50 transition-opacity blur-2xl" />
                
                <div className="w-12 h-12 rounded-xl bg-[#f8fafc] border border-gray-100 flex items-center justify-center shrink-0 mb-4 group-hover:bg-[#0058be] group-hover:border-[#0058be] transition-colors z-10">
                  <Icon size={24} className="text-[#424754] group-hover:text-white transition-colors" />
                </div>
                
                <div className="flex items-center gap-2 mb-2 z-10">
                  <span className="text-sm font-bold text-[#0058be]/60">Step {idx + 1}</span>
                </div>
                
                <h3 className={`font-bold text-xl ${isLast ? 'text-[#0058be]' : 'text-[#0b1c30]'} z-10`}>
                  {step.label}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
