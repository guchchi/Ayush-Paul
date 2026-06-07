import React from 'react';
import { motion } from 'motion/react';
import { Users, PenTool, GraduationCap, Zap, Building2 } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

export const CollaborateWho = () => {
  const audiences = [
    {
      title: "Creators",
      desc: "Building audiences, brands, products, or digital assets.",
      icon: <PenTool size={18} />
    },
    {
      title: "Students",
      desc: "Learning to build, ship, and scale real-world projects.",
      icon: <GraduationCap size={18} />
    },
    {
      title: "Founders",
      desc: "Validating ideas, building MVPs, and scaling products.",
      icon: <Zap size={18} />
    },
    {
      title: "Businesses",
      desc: "Optimizing operations, workflows, and technical systems.",
      icon: <Building2 size={18} />
    }
  ];

  return (
    <section className="py-24 bg-bg-secondary/20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
            >
              <Users size={12} className="text-[#424754]" />
              Who It's For
            </motion.div>

            <motion.h2
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
            >
              Built For People<br />
              <span className="text-[#424754]/40">Who Want To Move Faster</span>
            </motion.h2>
          </div>
          
          <motion.p
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#424754] font-semibold max-w-sm text-sm"
          >
            This collaboration is designed for people who already have ambition, ideas, or momentum and want a clearer path toward execution.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {audiences.map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-[#0058be]/20 hover:scale-[1.01] transition-all shadow-sm duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-bg-secondary/60 border border-[#c2c6d6]/20 flex items-center justify-center text-[#424754] group-hover:bg-[#0b1c30] group-hover:text-white group-hover:border-[#0b1c30] transition-all duration-300 shadow-sm shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#0b1c30] mb-2 tracking-tight">{item.title}</h3>
                <p className="text-xs text-[#424754] font-semibold leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
