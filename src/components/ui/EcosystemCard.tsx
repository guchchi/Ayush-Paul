import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Github, ShieldCheck, Cpu } from 'lucide-react';

export interface EcosystemProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  logo: string; // Unsplash image or icon
  appUrl: string; // Live Vercel app
  githubUrl: string;
  status: 'Production' | 'Beta' | 'R&D';
  tech: string[];
}

interface EcosystemCardProps {
  project: EcosystemProduct;
}

export const EcosystemCard = ({ project }: EcosystemCardProps) => {
  const statusColors = {
    Production: 'text-green-400 bg-green-400/10 border-green-400/20',
    Beta: 'text-brand-primary bg-brand-primary/10 border-brand-primary/20',
    'R&D': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.005 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative glass-card glass-card-hover p-8 flex flex-col h-full overflow-hidden"
    >
      {/* Upper Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          {project.logo.startsWith('http') ? (
            <img src={project.logo} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <Cpu className="w-6 h-6 text-brand-primary" />
          )}
        </div>
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">{project.category}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-[9px] uppercase tracking-widest text-white/30 flex items-center gap-1">
            <ShieldCheck size={10} /> Ecosystem Verified
          </span>
        </div>

        <Link to={`/products/${project.slug}`}>
          <h3 className="text-2xl font-extrabold tracking-tight text-white mb-3 group-hover:text-brand-primary transition-colors">
            {project.title}
          </h3>
        </Link>
        
        <p className="text-white/40 text-sm leading-relaxed mb-6 font-medium line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Tech Stack Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {project.tech.map((t, idx) => (
          <span key={idx} className="px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-bold text-white/60">
            {t}
          </span>
        ))}
      </div>

      {/* CTA Footer Actions */}
      <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
        <a 
          href={project.githubUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          <Github size={16} /> Codebase
        </a>

        <div className="flex items-center gap-3">
          <Link 
            to={`/products/${project.slug}`}
            className="text-xs font-bold uppercase tracking-widest text-brand-primary hover:text-white transition-colors mr-2"
          >
            Learn More
          </Link>
          <a 
            href={project.appUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-brand-primary text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,194,255,0.2)]"
          >
            Open App <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
