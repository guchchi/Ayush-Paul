import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Calendar, Layers, Activity, Star } from 'lucide-react';
import { db, collection, query, where, getDocs } from '../firebase';
import { Section } from '../components/ui/Section';
import { MagneticButton } from '../components/ui/MagneticButton';
import { VARIANTS, EASING } from '../lib/motion-presets';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

export const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;
      try {
        const q = query(collection(db, "projects"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setProject({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Link to="/projects" className="text-brand-primary hover:underline">Return to Projects</Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0A0A0A] min-h-screen pt-44 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <Link to="/projects" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 text-sm font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Showcase
        </Link>

        <motion.div variants={VARIANTS.fadeUp} initial="initial" animate="animate" className="space-y-8 mb-16">
          <div className="flex flex-wrap items-center gap-4">
            <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-current opacity-80", project.statusColor || "text-brand-primary bg-brand-primary/10")}>
              {project.status || "Building"}
            </span>
            <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-4 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Star size={12} /> Featured
              </span>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">{project.title}</h1>
          <p className="text-xl md:text-2xl text-white/50 font-medium leading-relaxed max-w-3xl">
            {project.vision || project.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-white/40 pt-6 border-t border-white/5">
            {project.projectDate && (
              <div className="flex items-center gap-2"><Calendar size={16} /> {project.projectDate}</div>
            )}
            {project.tech && project.tech.length > 0 && (
              <div className="flex items-center gap-2"><Layers size={16} /> {Array.isArray(project.tech) ? project.tech.join(' • ') : project.tech}</div>
            )}
          </div>
        </motion.div>

        {project.image && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="aspect-video w-full rounded-[40px] overflow-hidden border border-white/10 mb-20 relative group"
          >
            <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="absolute top-6 right-6 p-4 bg-black/50 backdrop-blur-md rounded-full text-white hover:text-brand-primary transition-colors border border-white/10">
                <ExternalLink size={20} />
              </a>
            )}
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 prose prose-invert prose-brand max-w-none">
            {project.caseStudy ? (
              <ReactMarkdown>{project.caseStudy}</ReactMarkdown>
            ) : (
              <p className="text-white/60 leading-relaxed text-lg">{project.description}</p>
            )}

            {project.gallery && (
              <div className="mt-16 grid grid-cols-2 gap-4">
                {(Array.isArray(project.gallery) ? project.gallery : project.gallery.split(',')).map((img: string, i: number) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/10">
                    <img src={img.trim()} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2"><Activity size={16} /> Market Impact</h3>
              <p className="text-brand-primary font-bold">{project.impact || "Measuring impact in production environment."}</p>
            </div>

            {project.metrics && Object.keys(project.metrics).length > 0 && (
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Key Metrics</h3>
                <div className="space-y-6">
                  {Object.entries(project.metrics).map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">{k}</div>
                      <div className="text-2xl font-bold">{String(v)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
