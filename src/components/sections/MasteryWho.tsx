import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Code, Palette, Rocket, ArrowRight } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

interface MasteryWhoProps {
  onExploreClick: () => void;
}

const AUDIENCES = [
  {
    id: 'students',
    icon: GraduationCap,
    title: 'Students',
    description: 'Future-proof your skills with practical AI, robotics, and engineering knowledge that goes beyond textbooks.',
    benefits: ['Portfolio-ready projects', 'Real systems experience', 'Industry-relevant skills'],
    color: '#0058be',
    bg: '#eff4ff',
    border: '#dce9ff'
  },
  {
    id: 'developers',
    icon: Code,
    title: 'Developers',
    description: 'Ship faster with ready-to-use templates, automation workflows, and system architectures you can deploy immediately.',
    benefits: ['Pre-built blueprints', 'Production templates', 'System architectures'],
    color: '#6b35ff',
    bg: '#f3efff',
    border: '#ebe5ff'
  },
  {
    id: 'creators',
    icon: Palette,
    title: 'Creators',
    description: 'Monetize your knowledge by learning to build and launch digital products, design systems, and automated content pipelines.',
    benefits: ['Digital product skills', 'Design system mastery', 'Content automation'],
    color: '#558b2f',
    bg: '#f0fbe8',
    border: '#e1f7d2'
  },
  {
    id: 'founders',
    icon: Rocket,
    title: 'Founders',
    description: 'Build and launch products without a technical co-founder. Learn to architect, build, and ship working software.',
    benefits: ['Full-stack fundamentals', 'MVP architecture', 'Stripe + auth integration'],
    color: '#ff8000',
    bg: '#fff4eb',
    border: '#ffe9d6'
  }
];

export const MasteryWho = ({ onExploreClick }: MasteryWhoProps) => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-16 text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
            <span className="tracking-[0.22em]">Who This Is For</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Built for<br />
            <span className="text-[#d1f34d]">Builders Like You</span>
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Mastery is designed for anyone who wants to turn knowledge into real outcomes — whether you are starting your first project or shipping your tenth product.
        </motion.p>
      </div>

      {/* 4-Audience Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {AUDIENCES.map((audience, idx) => {
          const Icon = audience.icon;
          return (
            <motion.div
              key={audience.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 bg-white border border-[#c2c6d6]/30 rounded-[28px] shadow-sm hover:shadow-ambient hover:scale-[1.01] hover:-translate-y-1 hover:border-[#d1f34d] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center border mb-6 shadow-sm"
                  style={{ backgroundColor: audience.bg, borderColor: audience.border, color: audience.color }}
                >
                  <Icon size={20} />
                </div>

                <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight mb-2">
                  {audience.title}
                </h3>
                <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
                  {audience.description}
                </p>

                <div className="space-y-2.5 mb-8">
                  {audience.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 text-[11px] font-bold text-[#0b1c30]">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: audience.color }} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <MagneticButton>
                <button
                  onClick={onExploreClick}
                  className="w-full py-3 bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d] rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  Start Learning
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </MagneticButton>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};