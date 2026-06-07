import React from 'react';
import { motion } from 'motion/react';
import { Layers, Rocket, Globe, Workflow, Shield, Cpu } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

export const CollaborateProjects = () => {
  const projects = [
    {
      title: "MVP Development",
      desc: "Go from zero to one. End-to-end architecture and development for your startup idea.",
      icon: <Rocket className="text-[#0058be]" size={22} />,
      colSpan: "md:col-span-2",
      bg: "bg-[#eff4ff]"
    },
    {
      title: "Custom AI Agents",
      desc: "Implement autonomous LLM workflows tailored to your specific business operations.",
      icon: <Cpu className="text-[#6b35ff]" size={22} />,
      colSpan: "md:col-span-1",
      bg: "bg-[#f3efff]"
    },
    {
      title: "Web Applications",
      desc: "High-performance, scalable React/Next.js platforms.",
      icon: <Globe className="text-[#ff8000]" size={22} />,
      colSpan: "md:col-span-1",
      bg: "bg-[#fff4eb]"
    },
    {
      title: "Automation Engines",
      desc: "Connecting disparate tools into a unified, zero-maintenance execution pipeline.",
      icon: <Workflow className="text-[#558b2f]" size={22} />,
      colSpan: "md:col-span-2",
      bg: "bg-[#f0fbe8]"
    },
    {
      title: "Technical Audits",
      desc: "Reviewing architecture, performance bottlenecks, and SEO structuring.",
      icon: <Shield className="text-[#424754]" size={22} />,
      colSpan: "md:col-span-1",
      bg: "bg-gray-50"
    },
    {
      title: "Design Systems",
      desc: "Creating reusable component libraries to unify your product's visual language.",
      icon: <Layers className="text-[#0058be]" size={22} />,
      colSpan: "md:col-span-2",
      bg: "bg-[#eff4ff]"
    }
  ];

  return (
    <section className="py-24 bg-bg-secondary/20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <Layers size={12} className="text-[#424754]" />
            Capabilities
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            What We <span className="text-[#0058be]">Build.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] group hover:border-[#0058be]/20 hover:scale-[1.01] hover:shadow-sm transition-all duration-300 flex flex-col justify-between ${project.colSpan} overflow-hidden relative shadow-sm`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 ${project.bg}/50 transition-transform group-hover:scale-110 duration-500`} />
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-2xl border border-[#c2c6d6]/20 flex items-center justify-center shadow-sm mb-6">
                  {project.icon}
                </div>
              </div>
              
              <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-extrabold text-[#0b1c30] mb-2 tracking-tight">{project.title}</h3>
                <p className="text-xs text-[#424754] font-semibold leading-relaxed max-w-sm">
                  {project.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
