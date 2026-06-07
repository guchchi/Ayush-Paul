import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  BookOpen, 
  Video, 
  Users, 
  Compass, 
  Lock,
  ChevronRight,
  Network,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { MagneticButton } from '../ui/MagneticButton';

interface MasteryHeroProps {
  onExploreClick: () => void;
  onCoursesClick: () => void;
}

const ecosystemNodes = [
  {
    id: 'courses',
    label: 'Courses',
    desc: 'Self-paced curricula',
    icon: BookOpen,
    color: '#0058be',
    bg: '#eff4ff',
    border: '#dce9ff',
    tag: 'Self-Paced'
  },
  {
    id: 'workshops',
    label: 'Workshops',
    desc: 'Live build cohorts',
    icon: Video,
    color: '#6b35ff',
    bg: '#f3efff',
    border: '#ebe5ff',
    tag: 'Live Builds'
  },
  {
    id: '1-on-1',
    label: '1-on-1 Learning',
    desc: 'Tutoring & doubt solving',
    icon: Users,
    color: '#558b2f',
    bg: '#f0fbe8',
    border: '#e1f7d2',
    tag: 'Tutoring'
  },
  {
    id: 'blueprints',
    label: 'Blueprints',
    desc: 'Done-for-you assets',
    icon: Compass,
    color: '#ff8000',
    bg: '#fff4eb',
    border: '#ffe9d6',
    tag: 'Blueprints'
  },
  {
    id: 'vault',
    label: 'Vault',
    desc: 'Your owned locker',
    icon: Lock,
    color: '#c2185b',
    bg: '#fce4ec',
    border: '#f8bbd0',
    tag: 'Vault Locker'
  }
];

export const MasteryHero = ({ onExploreClick, onCoursesClick }: MasteryHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lines, setLines] = useState<{ d: string; color: string }[]>([]);

  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current || !rootRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const rootRect = rootRef.current.getBoundingClientRect();

      // Right-center of the root node
      const rootX = rootRect.right - containerRect.left;
      const rootY = rootRect.top + rootRect.height / 2 - containerRect.top;

      const newLines = ecosystemNodes.map((node, index) => {
        const el = nodeRefs.current[index];
        if (!el) return { d: '', color: node.color };
        const elRect = el.getBoundingClientRect();
        
        // Left-center of the child card
        const childX = elRect.left - containerRect.left;
        const childY = elRect.top + elRect.height / 2 - containerRect.top;

        // Custom cubic bezier curve
        const controlX1 = rootX + (childX - rootX) * 0.45;
        const controlY1 = rootY;
        const controlX2 = rootX + (childX - rootX) * 0.55;
        const controlY2 = childY;

        const pathD = `M ${rootX} ${rootY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${childX} ${childY}`;
        return { d: pathD, color: node.color };
      });

      setLines(newLines);
    };

    // Wait a tiny bit for render to complete, then update coordinates
    const timer = setTimeout(updateLines, 100);
    window.addEventListener('resize', updateLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateLines);
    };
  }, []);

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
              <span className="tracking-[0.22em]">Ecosystem</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tighter leading-[1.05] text-[#0b1c30] mb-8"
            >
              Master The Skills<br />
              <span className="text-[#0058be]">Behind Modern Builders</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-[#424754] font-medium max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              Learn practical skills, access implementation assets, join live workshops, or learn directly with me.
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
                  className="px-8 py-4 bg-[#0b1c30] text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 group hover:scale-105 transition-transform w-full sm:w-auto shadow-sm cursor-pointer border-none"
                >
                  Explore Skills
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#0058be]" />
                </button>
              </MagneticButton>

              <MagneticButton>
                <button
                  onClick={onCoursesClick}
                  className="px-8 py-4 bg-white border border-[#c2c6d6]/30 text-[#0b1c30] rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm cursor-pointer"
                >
                  Browse Courses
                  <ArrowUpRight size={14} className="text-[#0058be]" />
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
                  12+
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">
                  Compound Skills
                </span>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-2xl font-extrabold text-[#0b1c30] tracking-tight leading-none mb-1">
                  3
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">
                  Product Pillars
                </span>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-2xl font-extrabold text-[#0058be] tracking-tight leading-none mb-1">
                  100%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">
                  Practical Focus
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Premium Ecosystem Map Tree ── */}
          <div 
            ref={containerRef}
            className="lg:col-span-6 relative flex flex-col lg:flex-row items-center justify-center w-full min-h-[500px]"
          >
            {/* SVG Connecting lines for desktop */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block z-0">
              <svg className="w-full h-full overflow-visible">
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* Background line shadow */}
                    <path
                      d={line.d}
                      fill="none"
                      stroke="#c2c6d6"
                      strokeWidth="2"
                      strokeOpacity="0.1"
                    />
                    {/* Primary connection line */}
                    <path
                      d={line.d}
                      fill="none"
                      stroke={line.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.25"
                    />
                    {/* Flow pulse dash path */}
                    <motion.path
                      d={line.d}
                      fill="none"
                      stroke={line.color}
                      strokeWidth="2"
                      strokeDasharray="4, 12"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: -40 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </React.Fragment>
                ))}
              </svg>
            </div>

            {/* Tree Structure Layout */}
            <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-center gap-10 relative z-10">
              
              {/* Root Trunk (left column on desktop, top on mobile) */}
              <div className="flex lg:w-1/3 items-center justify-center">
                <motion.div
                  ref={rootRef}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="px-6 py-4 bg-[#0b1c30] text-white border border-[#0058be]/30 rounded-2xl shadow-xl flex flex-col items-center gap-2 text-center relative z-25 group hover:border-[#0058be] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0058be]/10 border border-[#0058be]/30 flex items-center justify-center text-[#0058be]">
                    <Network size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0058be]">Mastery</h3>
                    <p className="text-[9px] font-bold text-white/50 uppercase mt-0.5">Ecosystem Map</p>
                  </div>
                </motion.div>
              </div>

              {/* Children Nodes (right column on desktop, bottom on mobile) */}
              <div className="flex-1 flex flex-col gap-4 relative pl-6 lg:pl-0 border-l border-dashed border-[#c2c6d6]/40 lg:border-l-0">
                {ecosystemNodes.map((node, index) => {
                  const Icon = node.icon;
                  return (
                    <motion.div
                      key={node.id}
                      ref={(el) => { nodeRefs.current[index] = el; }}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      whileHover={{ x: 4, scale: 1.01 }}
                      className="p-4 bg-white border border-[#c2c6d6]/30 rounded-2xl shadow-sm flex items-center justify-between gap-4 w-full relative z-10 text-left hover:border-[#0058be]/20 hover:shadow-ambient transition-all duration-300"
                    >
                      {/* Left side node data */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                          style={{ backgroundColor: node.bg, borderColor: node.border, color: node.color }}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-[#0b1c30] leading-none mb-1">
                            {node.label}
                          </h4>
                          <p className="text-[10px] text-[#424754] font-semibold leading-none truncate">
                            {node.desc}
                          </p>
                        </div>
                      </div>

                      {/* Right Tag/Badge */}
                      <span 
                        className="px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider shrink-0 border"
                        style={{ backgroundColor: node.bg, borderColor: node.border, color: node.color }}
                      >
                        {node.tag}
                      </span>
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
