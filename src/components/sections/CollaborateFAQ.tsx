import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';
import { cn } from '../../lib/utils';

export const CollaborateFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Who owns the Intellectual Property (IP)?",
      a: "You do. Full ownership and IP rights are transferred to you upon project completion. I build using clean, documented code and industry-standard repositories (GitHub/GitLab) so your technical team can take over seamlessly."
    },
    {
      q: "What is the typical timeline for an MVP?",
      a: "Speed is a feature. Most MVPs ship in 2 to 4 weeks. By utilizing my battle-tested 'Startup Engine'—a pre-built architecture for auth, database, and UI—we focus 100% of our time on your unique core value proposition."
    },
    {
      q: "How do you handle technical scaling?",
      a: "I architect for scale from Day 1. By leveraging serverless infrastructure (Vercel/AWS), edge computing, and optimized database schemas, your product can scale from 1 to 100k+ users without a complete rewrite."
    },
    {
      q: "What happens after the product is launched?",
      a: "Launch is just the beginning. I provide 30 days of complimentary 'Hyper-Care' to resolve any post-launch bugs. Afterward, we can discuss ongoing maintenance retainers or I can help you interview and transition to your first full-time hire."
    },
    {
      q: "Do you just build what I tell you to build?",
      a: "No. You're hiring a technical partner, not just a pair of hands. I challenge assumptions, suggest product improvements, and prioritize features based on user value and technical feasibility to ensure we build a product that actually wins."
    }
  ];

  return (
    <section className="py-24 bg-bg-elevated relative border-y border-[#c2c6d6]/20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-secondary border border-[#c2c6d6]/20 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <HelpCircle size={12} className="text-[#424754]" />
            FAQ
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Questions Worth <span className="text-[#0058be]">Asking.</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={false}
              className={cn(
                "bg-white border rounded-[24px] overflow-hidden transition-all duration-300 shadow-sm",
                openIndex === i ? "border-[#0058be] ring-1 ring-[#0058be]/10" : "border-[#c2c6d6]/35 hover:border-[#c2c6d6]/50"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left group"
              >
                <span className={cn(
                  "text-base font-extrabold tracking-tight pr-6 transition-colors",
                  openIndex === i ? "text-[#0058be]" : "text-[#0b1c30]"
                )}>
                  {faq.q}
                </span>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                  openIndex === i ? "rotate-90 bg-[#eff4ff] text-[#0058be]" : "bg-bg-secondary text-[#424754]/60 group-hover:bg-[#eff4ff] group-hover:text-[#0058be]"
                )}>
                  <ChevronRight size={18} />
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-6 pb-6 text-xs text-[#424754] font-semibold leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
