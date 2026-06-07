import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Layout, Code, Rocket, Activity } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

export const CollaborateProcess = () => {
  const steps = [
    { 
      title: "Discovery & Strategy", 
      desc: "Aligning on vision, defining scope, and evaluating technical feasibility to ensure we're solving the right problem.",
      icon: <MessageSquare size={18} />
    },
    { 
      title: "System Architecture", 
      desc: "Designing the technical foundation, database schemas, and UX workflows before writing a single line of code.",
      icon: <Layout size={18} />
    },
    { 
      title: "Execution & Build", 
      desc: "Rapid, transparent development cycles. You see the progress live as we turn the architecture into a working product.",
      icon: <Code size={18} />
    },
    { 
      title: "Handoff & Scale", 
      desc: "Deploying to production, comprehensive documentation, and ensuring you have full ownership of the resulting systems.",
      icon: <Rocket size={18} />
    }
  ];

  return (
    <section className="py-24 bg-bg-elevated relative border-y border-[#c2c6d6]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-secondary border border-[#c2c6d6]/20 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <Activity size={12} className="text-[#424754]" />
            Methodology
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            How We <span className="text-[#0058be]">Work.</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-[#c2c6d6]/20 -translate-y-1/2 -z-10" />

          <div className="grid md:grid-cols-4 gap-8 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="relative bg-bg-elevated pt-8 md:pt-0"
              >
                {/* Mobile Connector */}
                {i !== 0 && (
                  <div className="md:hidden absolute top-[-2rem] left-6 w-px h-8 bg-[#c2c6d6]/20" />
                )}

                <div className="flex flex-col items-start md:items-center text-left md:text-center group">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#c2c6d6]/20 flex items-center justify-center text-[#424754]/40 mb-6 group-hover:border-[#0058be] group-hover:text-[#0058be] transition-all duration-300 shadow-sm relative z-10">
                    {step.icon}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold text-[#424754]/40 uppercase tracking-widest">Phase 0{i + 1}</div>
                    <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight">{step.title}</h3>
                    <p className="text-xs text-[#424754] font-semibold leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
