import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useAnalytics } from '../../../hooks/useAnalytics';

export const FAQSection = () => {
  const { trackEvent } = useAnalytics();
  
  const faqs = [
    {
      q: "Why is this free during beta?",
      a: "Because it's in public beta and we want your feedback to shape the final product. The core implementation workflow is ready, but we are actively refining the experience."
    },
    {
      q: "Will I keep access after beta?",
      a: "Yes, beta users keep access to the core workflow they helped test. Future premium features (like AI generation and advanced automation) will be a separate upgrade."
    },
    {
      q: "What if I get stuck?",
      a: "The system breaks every step down into micro-actions. You're never asked to do something without a framework. You can also provide feedback directly in the app if something is unclear."
    },
    {
      q: "Can I use this without experience?",
      a: "Yes. The system is specifically designed to help you build authority, define a niche, and create an offer from absolutely zero."
    },
    {
      q: "Is this theory or implementation?",
      a: "100% implementation. You learn by building real assets (a portfolio, an offer, outreach scripts), not by watching 40-hour video courses."
    },
    {
      q: "Do I need AI tools?",
      a: "No. While Premium will include AI assistance, the beta is designed to work perfectly with your own human brain. The frameworks are what matter."
    },
    {
      q: "Can I skip modules?",
      a: "It is highly recommended to follow the journey linearly, as each step acts as a foundation for the next. Your offer depends on your niche, and your outreach depends on your offer."
    },
    {
      q: "How is this different from YouTube?",
      a: "YouTube gives you fragmented, out-of-order information. This gives you a sequential, decision-by-decision implementation system where every step builds on the last."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number, question: string) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
      trackEvent('faq_expanded', { question });
    }
  };

  return (
    <section>
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-4">Frequently Asked Questions</h2>
        <p className="text-[#424754] text-lg max-w-2xl">
          Everything you need to know about joining the beta.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={cn(
                "border rounded-xl transition-colors duration-200 overflow-hidden bg-white",
                isOpen ? "border-[#0058be]" : "border-gray-200 hover:border-gray-300"
              )}
            >
              <button
                onClick={() => toggle(index, faq.q)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-semibold text-lg text-[#0b1c30] pr-8">{faq.q}</span>
                <ChevronDown 
                  className={cn(
                    "shrink-0 text-gray-400 transition-transform duration-300",
                    isOpen && "transform rotate-180 text-[#0058be]"
                  )} 
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-0 text-[#424754] leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
