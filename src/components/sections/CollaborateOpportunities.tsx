import React from 'react';
import { motion } from 'motion/react';
import { Target, Monitor, Bot, LineChart, Briefcase } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

export const CollaborateOpportunities = () => {
  const opportunities = [
    {
      title: "Digital Products",
      desc: "Build websites, platforms, MVPs, tools, and digital experiences designed for growth.",
      icon: <Monitor size={22} />,
      color: "text-[#0058be]",
      bg: "bg-[#eff4ff] border border-[#dce9ff]"
    },
    {
      title: "AI Workflows",
      desc: "Implement AI-powered processes that improve research, content, productivity, and operations.",
      icon: <Bot size={22} />,
      color: "text-[#6b35ff]",
      bg: "bg-[#f3efff] border border-[#ebe5ff]"
    },
    {
      title: "SEO & Authority",
      desc: "Create content systems and discoverability strategies that compound over time.",
      icon: <LineChart size={22} />,
      color: "text-[#ff8000]",
      bg: "bg-[#fff4eb] border border-[#ffe9d6]"
    },
    {
      title: "Business Systems",
      desc: "Design workflows, automations, and operating systems that reduce friction and improve execution.",
      icon: <Briefcase size={22} />,
      color: "text-[#558b2f]",
      bg: "bg-[#f0fbe8] border border-[#e1f7d2]"
    }
  ];

  return (
    <section className="py-24 bg-bg-elevated relative border-y border-[#c2c6d6]/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <Target size={12} className="text-[#424754]" />
            Opportunities
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] mb-6 text-[#0b1c30]"
          >
            Different Goals.<br />
            <span className="text-[#424754]/40">Shared Execution.</span>
          </motion.h2>

          <motion.p
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-[#424754] font-medium"
          >
            Every project is different, but the objective remains the same: creating systems that move ideas forward with clarity and momentum.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {opportunities.map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="p-8 bg-bg-secondary/30 border border-[#c2c6d6]/20 rounded-[32px] group hover:bg-white hover:border-[#0058be]/20 hover:scale-[1.01] hover:shadow-sm transition-all duration-300 flex flex-col"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-[1.03] duration-300 ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-extrabold text-[#0b1c30] mb-3 tracking-tight">{item.title}</h3>
              <p className="text-xs text-[#424754] font-semibold leading-relaxed flex-1">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
