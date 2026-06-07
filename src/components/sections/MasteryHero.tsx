import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ArrowDown, 
  BookOpen, 
  Video, 
  Users, 
  Compass, 
  Lock,
  ArrowUpRight,
  TrendingUp,
  Boxes,
  Zap,
  CheckCircle2 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { MagneticButton } from '../ui/MagneticButton';

interface MasteryHeroProps {
  onExploreClick: () => void;
  onPathsClick: () => void;
}

const centralSteps = [
  { label: 'Learn', desc: 'Practical concepts' },
  { label: 'Build', desc: 'Real applications' },
  { label: 'Launch', desc: 'Deploy systems' },
  { label: 'Grow', desc: 'Scale authority' }
];

const orbitNodes = [
  {
    label: 'Courses',
    desc: 'Self-paced curricula',
    icon: BookOpen,
    color: '#0058be',
    bg: '#eff4ff',
    border: '#dce9ff',
    posClass: 'lg:absolute lg:top-[-40px] lg:left-[40px]',
    delay: 0,
    yFloat: -8
  },
  {
    label: 'Workshops',
    desc: 'Live build cohorts',
    icon: Video,
    color: '#6b35ff',
    bg: '#f3efff',
    border: '#ebe5ff',
    posClass: 'lg:absolute lg:top-[-40px] lg:right-[40px]',
    delay: 0.1,
    yFloat: -6
  },
  {
    label: 'Mentorship',
    desc: '1-on-1 private training',
    icon: Users,
    color: '#558b2f',
    bg: '#f0fbe8',
    border: '#e1f7d2',
    posClass: 'lg:absolute lg:bottom-[-40px] lg:left-[40px]',
    delay: 0.2,
    yFloat: -7
  },
  {
    label: 'Blueprints',
    desc: 'Done-for-you assets',
    icon: Compass,
    color: '#ff8000',
    bg: '#fff4eb',
    border: '#ffe9d6',
    posClass: 'lg:absolute lg:bottom-[-40px] lg:right-[40px]',
    delay: 0.3,
    yFloat: -9
  },
  {
    label: 'Vault',
    desc: 'Your owned locker',
    icon: Lock,
    color: '#c2185b',
    bg: '#fce4ec',
    border: '#f8bbd0',
    posClass: 'lg:absolute lg:top-[50%] lg:translate-y-[-50%] lg:right-[-60px]',
    delay: 0.15,
    yFloat: -5
  }
];

export const MasteryHero = ({ onExploreClick, onPathsClick }: MasteryHeroProps) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 px-6 overflow-hidden bg-bg-primary text-text-primary">
      {/* Background Soft Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,88,190,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(0,88,190,0.012)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT: Typography + CTAs ── */}
          <div className="flex flex-col lg:col-span-6 text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#0058be] shadow-sm mb-8 mx-auto lg:mx-0"
            >
              <span className="w-1.5 h-1.5 bg-[#0058be] rounded-full animate-pulse" />
              <span className="tracking-[0.22em]">Skill Ecosystem</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[1.05] text-[#0b1c30] mb-8"
            >
              Skills Behind<br />
              <span className="text-[#0058be]">The Builders</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-[#424754] font-medium max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              Master high-leverage frameworks and configurations that compound over time. Shift from passive content consumption to hands-on execution.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-12"
            >
              <MagneticButton>
                <button
                  onClick={onExploreClick}
                  className="px-8 py-4 bg-[#0b1c30] text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 group hover:scale-105 transition-transform w-full sm:w-auto shadow-sm cursor-pointer"
                >
                  Explore Skills
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </MagneticButton>

              <MagneticButton>
                <button
                  onClick={onPathsClick}
                  className="px-8 py-4 bg-white border border-[#c2c6d6]/30 text-[#0b1c30] rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm cursor-pointer"
                >
                  Choose How to Learn
                  <ArrowDown size={14} className="text-[#0058be]" />
                </button>
              </MagneticButton>
            </motion.div>

            {/* Stats / Trust Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-[#c2c6d6]/20"
            >
              <div className="flex flex-col text-left">
                <span className="text-2xl font-extrabold text-[#0b1c30] tracking-tight leading-none mb-1">
                  100%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">
                  Execution-First
                </span>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-2xl font-extrabold text-[#0b1c30] tracking-tight leading-none mb-1">
                  10+
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">
                  Skill Domains
                </span>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-2xl font-extrabold text-[#0058be] tracking-tight leading-none mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={18} className="text-[#0058be]" />
                  Active
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">
                  Validation
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Visual Ecosystem orbit flow ── */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center w-full min-h-[480px]">
            {/* Radial background glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="w-[320px] h-[320px] bg-[#0058be]/5 rounded-full filter blur-[80px]" />
            </div>

            {/* Orbit Container */}
            <div className="relative w-full max-w-[460px] h-[400px] flex flex-col items-center justify-center lg:block">
              
              {/* CENTRAL PROCESS LOOP CARD */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="z-20 p-6 bg-white border border-[#c2c6d6]/40 rounded-[28px] shadow-lg text-center max-w-[280px] w-full lg:absolute lg:top-[50%] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] mb-8 lg:mb-0"
              >
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <TrendingUp size={14} className="text-[#0058be]" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#424754]/70">
                    Execution Loop
                  </span>
                </div>
                
                {/* Central Flow Steps */}
                <div className="grid grid-cols-4 gap-1.5 items-center justify-center relative">
                  {centralSteps.map((step, idx) => (
                    <div key={step.label} className="flex flex-col items-center relative group">
                      <div className="w-8 h-8 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-[#0058be] font-extrabold text-[10px] uppercase flex items-center justify-center shadow-sm relative z-10 hover:bg-[#0058be] hover:text-white hover:border-[#0058be] transition-colors duration-200">
                        {step.label.substring(0, 1)}
                      </div>
                      <span className="text-[9px] font-bold text-[#0b1c30] mt-1.5">
                        {step.label}
                      </span>
                      {/* Hover details tooltip */}
                      <span className="absolute bottom-[-28px] left-[50%] translate-x-[-50%] bg-[#0b1c30] text-white text-[8px] font-semibold py-0.5 px-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md z-30">
                        {step.desc}
                      </span>
                    </div>
                  ))}
                  
                  {/* Connecting Arrow Lines for central loop */}
                  <div className="absolute top-[15px] left-[15%] right-[15%] h-[1px] border-t border-dashed border-[#c2c6d6]/60 -z-0 pointer-events-none" />
                </div>
              </motion.div>

              {/* Orbiting Badges/Cards */}
              <div className="w-full grid grid-cols-2 gap-4 lg:contents">
                {orbitNodes.map((node, idx) => {
                  const Icon = node.icon;
                  return (
                    <motion.div
                      key={node.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: [0, node.yFloat, 0] 
                      }}
                      transition={{ 
                        opacity: { duration: 0.5, delay: node.delay },
                        y: { 
                          duration: 4 + idx, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: node.delay 
                        }
                      }}
                      whileHover={{ scale: 1.03 }}
                      className={cn(
                        "p-4 bg-white border border-[#c2c6d6]/30 rounded-[20px] shadow-sm flex items-center gap-3 w-full lg:w-[190px] transition-all duration-300 hover:shadow-ambient",
                        node.posClass
                      )}
                      style={{ borderLeft: `3px solid ${node.color}` }}
                    >
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{ backgroundColor: node.bg, borderColor: node.border, color: node.color }}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="text-left min-w-0">
                        <h4 className="text-[11px] font-extrabold text-[#0b1c30] leading-none mb-0.5">
                          {node.label}
                        </h4>
                        <p className="text-[9px] text-[#424754] font-semibold truncate leading-none">
                          {node.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
