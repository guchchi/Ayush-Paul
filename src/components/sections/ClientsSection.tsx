import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { MessageSquare } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

export const ClientsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Startup Founder",
      text: "Ayush is a rare talent. His ability to understand complex requirements and deliver high-quality code is impressive.",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
      name: "David Chen",
      role: "Tech Lead",
      text: "The AI application Ayush built for us exceeded our expectations. His knowledge of prompt engineering is top-notch.",
      avatar: "https://i.pravatar.cc/150?u=david",
    },
    {
      name: "Elena Rodriguez",
      role: "Creative Director",
      text: "Working with Ayush on our branding was a breeze. He has a great eye for design and a very professional approach.",
      avatar: "https://i.pravatar.cc/150?u=elena",
    },
  ];

  return (
    <Section id="clients" glowVariant="side" className="pt-24 overflow-visible">
      <div className="text-center mb-24">
        <motion.div 
          variants={VARIANTS.fadeUp} 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-6"
        >
          Social Validation
        </motion.div>
        <motion.h2 
          variants={VARIANTS.fadeUp} 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }} 
          className="mb-6 leading-tight tracking-tighter"
        >
          Client <span className="text-brand-primary italic">Love</span>
        </motion.h2>
        <motion.p 
          variants={VARIANTS.fadeUp} 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }} 
          transition={{ delay: 0.1 }} 
          className="text-white/40 text-xl italic font-medium max-w-2xl mx-auto text-center"
        >
          What people say about working with me. I focus on delivering long-term value and engineering excellence.
        </motion.p>
      </div>

      <motion.div 
        variants={VARIANTS.staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 min-w-0"
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            variants={VARIANTS.fadeUp}
            whileHover={VARIANTS.lift.whileHover}
            transition={{ ...VARIANTS.fadeUp.transition, delay: i * 0.1 }}
            className="p-8 md:p-12 rounded-[32px] md:rounded-[48px] glass-card border border-white/5 relative shadow-xl min-w-0 break-words overflow-visible"
          >
            <div className="absolute -top-7 left-8 md:left-12 w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-brand-primary/30 z-20">
               <MessageSquare size={24} />
            </div>
            <p className="text-lg md:text-xl text-white/70 italic mb-8 md:mb-12 leading-relaxed pt-6 font-medium break-words relative z-10">
              "{t.text}"
            </p>
            <div className="flex items-center gap-4 md:gap-5 pt-8 md:pt-10 border-t border-white/5 min-w-0 relative z-10">
              <img src={t.avatar} alt={t.name} className="w-12 h-12 md:w-16 md:h-16 rounded-2xl border border-white/10 shadow-lg shrink-0" referrerPolicy="no-referrer" />
              <div className="min-w-0 overflow-hidden">
                <h4 className="text-base md:text-lg font-bold text-white tracking-tight truncate">{t.name}</h4>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold truncate">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};
