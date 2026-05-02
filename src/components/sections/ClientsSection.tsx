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
    <Section id="clients" glowVariant="side" className="overflow-visible">
      <div className="section-header">
        <motion.div 
          variants={VARIANTS.fadeUp} 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }}
          className="badge"
        >
          Social Validation
        </motion.div>
        <motion.h2 
          variants={VARIANTS.fadeUp} 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }} 
        >
          Client <span className="text-brand-primary italic">Love</span>
        </motion.h2>
        <motion.p 
          variants={VARIANTS.fadeUp} 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }} 
          transition={{ delay: 0.1 }} 
          className="text-center italic"
        >
          What people say about working with me. I focus on delivering long-term value and engineering excellence.
        </motion.p>
      </div>

      <motion.div 
        variants={VARIANTS.staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            variants={VARIANTS.fadeUp}
            whileHover={VARIANTS.lift.whileHover}
            transition={{ ...VARIANTS.fadeUp.transition, delay: i * 0.1 }}
            className="p-10 lg:p-12 glass-card border-white/5 relative glass-card-hover overflow-visible"
          >
            <div className="absolute -top-7 left-10 lg:left-12 w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-brand-primary/30 z-20">
               <MessageSquare size={24} />
            </div>
            <p className="text-lg lg:text-xl text-white/70 italic mb-10 lg:mb-12 leading-relaxed pt-6 font-medium relative z-10">
              "{t.text}"
            </p>
            <div className="flex items-center gap-4 lg:gap-5 pt-8 lg:pt-10 border-t border-white/5 relative z-10">
              <img src={t.avatar} alt={t.name} className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl border border-white/10 shadow-lg shrink-0" referrerPolicy="no-referrer" />
              <div className="min-w-0 overflow-hidden">
                <h4 className="text-lg font-bold text-white tracking-tight truncate">{t.name}</h4>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold truncate">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};
