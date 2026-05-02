import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { 
  Rocket, Code, Cpu, User, Zap, BookOpen, Lightbulb, Github, 
  Box, Brain, ShieldCheck, Trophy, Layers 
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { VARIANTS, EASING } from '../../lib/motion-presets';

const StatsDashboard = () => {
  const stats = [
    { label: "Projects Completed", value: "50+", icon: <Rocket size={20} />, color: "text-blue-400" },
    { label: "Lines of Code", value: "100k+", icon: <Code size={20} />, color: "text-purple-400" },
    { label: "Robots Built", value: "12", icon: <Cpu size={20} />, color: "text-orange-400" },
    { label: "Happy Clients", value: "25+", icon: <User size={20} />, color: "text-green-400" },
  ];

  return (
    <motion.div 
      variants={VARIANTS.staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-32"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          variants={VARIANTS.fadeUp}
          whileHover={VARIANTS.lift.whileHover}
          transition={{ ...VARIANTS.fadeUp.transition, delay: i * 0.1 }}
          className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-white/5 text-center group hover:border-brand-primary/30 transition-all shadow-xl min-w-0 break-words overflow-hidden"
        >
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 md:mb-6 ${stat.color} group-hover:scale-110 group-hover:bg-brand-primary/10 transition-all duration-500`}>
            {stat.icon}
          </div>
          <div className="text-3xl md:text-5xl font-bold mb-1 md:mb-2 tracking-tighter text-white break-words">{stat.value}</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 truncate px-2">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const BrandEcosystem = () => {
  const items = [
    { title: "Currently Building", content: "A multi-agent AI framework for autonomous robotics.", icon: <Zap size={20} /> },
    { title: "Learning in Public", content: "Deep diving into Rust and WebAssembly for high-performance web apps.", icon: <BookOpen size={20} /> },
    { title: "Tech Philosophy", content: "Simplicity is the ultimate sophistication. Build for impact, not just for code.", icon: <Lightbulb size={20} /> },
  ];

  return (
    <motion.div 
      variants={VARIANTS.staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-32"
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          variants={VARIANTS.fadeUp}
          whileHover={VARIANTS.lift.whileHover}
          transition={{ ...VARIANTS.fadeUp.transition, delay: i * 0.1 }}
          className="p-8 md:p-12 rounded-[32px] md:rounded-[48px] glass-card border border-white/5 hover:border-brand-primary/20 transition-all group min-w-0 break-words overflow-hidden"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-8 md:mb-10 group-hover:scale-110 transition-transform">
            {item.icon}
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 tracking-tight break-words">{item.title}</h3>
          <p className="text-white/50 leading-relaxed text-base md:text-lg font-medium break-words">{item.content}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export const AuthoritySection = () => {
  const skillData = [
    { subject: 'AI / ML', A: 120, fullMark: 150 },
    { subject: 'Robotics', A: 110, fullMark: 150 },
    { subject: 'Full Stack', A: 140, fullMark: 150 },
    { subject: 'UI / UX', A: 90, fullMark: 150 },
    { subject: 'DevOps', A: 100, fullMark: 150 },
    { subject: 'Hardware', A: 115, fullMark: 150 },
  ];

  const pillars = [
    {
      id: 'builder',
      title: 'Builder',
      icon: <Box className="w-8 h-8 text-brand-primary" />,
      description: 'Production-grade systems and shipped products.',
      metrics: ['50+ Shipped Modules', 'Scalable Architecture', 'Production Reliability'],
      details: 'Expertise in building robust web applications and robotics systems that handle real-world scale.'
    },
    {
      id: 'creator',
      title: 'Creator',
      icon: <Zap className="w-8 h-8 text-brand-secondary" />,
      description: 'Design-led technical implementation.',
      metrics: ['4+ Years Design Ops', 'High-Signal UI/UX', 'Video & Motion Mastery'],
      details: 'Bridging the gap between high-end digital aesthetics and performant engineering.'
    },
    {
      id: 'technologist',
      title: 'Technologist',
      icon: <Brain className="w-8 h-8 text-brand-accent" />,
      description: 'AI, Automation, and Hardware crossover.',
      metrics: ['AI/ML Integration', 'Hardware-Software Sync', 'Workflow Automation'],
      details: 'Specializing in intelligent automation and robotics, connecting physical hardware with digital brains.'
    }
  ];

  return (
    <Section id="authority" glowVariant="center">
      <div className="text-center mb-24">
        <motion.div 
          variants={VARIANTS.fadeUp} 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-6"
        >
          Credibility & Impact
        </motion.div>
        <motion.h2 
          variants={VARIANTS.fadeUp} 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }} 
          className="mb-6 tracking-tighter"
        >
          Architecture of <span className="text-brand-primary">Authority</span>
        </motion.h2>
        <motion.p 
          variants={VARIANTS.fadeUp} 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }} 
          className="text-white/40 text-xl font-medium max-w-2xl mx-auto text-center"
        >
          A quantified view of my impact across software engineering, AI research, and robotics innovation.
        </motion.p>
      </div>

      <StatsDashboard />
      <BrandEcosystem />

      <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-center mb-32">
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-12"
        >
          <motion.h2 variants={VARIANTS.fadeUp} className="tracking-tighter leading-none text-4xl md:text-5xl">Technical <span className="text-brand-primary">Radar</span></motion.h2>
          <motion.p variants={VARIANTS.fadeUp} className="text-white/40 text-xl leading-relaxed font-medium">
            Core technical competencies across the full stack. I focus on the intersection of high-level software architecture and low-level hardware integration.
          </motion.p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "AI & ML", value: "Expert", desc: "Neural Networks, Computer Vision" },
              { label: "Robotics", value: "Advanced", desc: "ROS, Arduino, Embedded Systems" },
              { label: "Web Tech", value: "Master", desc: "React, Node.js, Cloud Arch" },
              { label: "Design", value: "Professional", desc: "Product UX, Visual Identity" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={VARIANTS.fadeUp}
                whileHover={VARIANTS.lift.whileHover}
                className="p-8 rounded-[32px] bg-white/5 border border-white/10 group hover:border-brand-primary/20 transition-all shadow-lg min-w-0"
              >
                <div className="text-brand-primary font-bold text-xl mb-1">{item.value}</div>
                <div className="text-white font-bold text-sm mb-2 uppercase tracking-wide">{item.label}</div>
                <div className="text-white/20 text-[10px] uppercase tracking-widest font-bold">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={VARIANTS.scaleUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="h-[400px] md:h-[500px] w-full glass-card rounded-[40px] md:rounded-[60px] p-6 md:p-12 flex items-center justify-center relative shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold', letterSpacing: '0.1em' }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <Radar name="Ayush" dataKey="A" stroke="#00C2FF" fill="#00C2FF" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.id}
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-10 rounded-[40px] border border-white/5 relative group hover:border-brand-primary/20 transition-all duration-500 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-[80px] -z-10 group-hover:opacity-100 transition-opacity opacity-50`} />
            <div className="flex flex-col h-full space-y-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                {pillar.icon}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2 tracking-tighter">{pillar.title}</h3>
                <p className="text-white/40 font-medium">{pillar.description}</p>
              </div>
              <div className="space-y-4 pt-8 border-t border-white/5 flex-grow">
                {pillar.metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-bold text-white/60 tracking-tight">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50" />
                    {metric}
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/20 leading-relaxed font-medium pt-4 group-hover:text-white/40 transition-colors">
                {pillar.details}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};
