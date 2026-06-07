import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    q: 'What is the Academy?',
    a: 'The Academy is a structured learning ecosystem designed to teach builders, creators, and developers how to design, engineer, and deploy modern systems, websites, automation, and AI workflows.',
  },
  {
    q: 'Do I get support while building?',
    a: 'Yes. All enrolled builders get access to our private community workspace where you can ask questions, get code help, and receive feedback on your systems.',
  },
  {
    q: 'Are the templates and blueprints included?',
    a: 'Yes. Every pathway provides download codes and links to the relevant templates, boilerplates, prompts, and playbooks in the course resources section.',
  },
  {
    q: 'Do I need technical skills to start?',
    a: 'We have pathways starting from absolute beginners (such as Web Foundations and AI workflows) up to advanced engineering configs. You can choose the entry point that fits your level.',
  },
  {
    q: 'How long do I have access to courses?',
    a: 'Once you enroll in a program, you get lifetime access to the curriculum, including future updates, resources, and community workspace access.',
  },
];

export const AcademyFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20">
      
      {/* Two-column header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-14 text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-secondary border border-[#c2c6d6]/20 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#424754] rounded-full" />
            <span className="tracking-[0.22em]">FAQ</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Questions Worth<br />
            Asking
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Everything you need to know about our learning tracks, community, resources, and implementation support.
        </motion.p>
      </div>

      {/* Accordion list */}
      <div className="space-y-4">
        {FAQ_DATA.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.35, delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "bg-white border rounded-[24px] overflow-hidden transition-all duration-300 shadow-sm",
                isOpen ? "border-[#0058be] ring-1 ring-[#0058be]/10" : "border-[#c2c6d6]/35 hover:border-[#c2c6d6]/50"
              )}
            >
              {/* Question row */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left gap-6 group cursor-pointer"
              >
                <span
                  className={cn(
                    "text-base font-extrabold tracking-tight leading-snug transition-colors duration-200 flex-1",
                    isOpen ? "text-[#0058be]" : "text-[#0b1c30]"
                  )}
                >
                  {item.q}
                </span>

                {/* +/− toggle icon */}
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border",
                    isOpen
                      ? "bg-[#eff4ff] border-[#dce9ff] text-[#0058be]"
                      : "bg-bg-secondary border-[#c2c6d6]/20 text-[#424754]/60 group-hover:border-[#0058be]/20 group-hover:text-[#0058be]"
                  )}
                >
                  {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                </span>
              </button>

              {/* Answer — animated */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-8 pb-6 text-xs text-[#424754] font-semibold leading-relaxed">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
};
