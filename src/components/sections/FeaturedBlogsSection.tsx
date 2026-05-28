import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, BookOpen, Clock } from 'lucide-react';
import { db, collection, query, onSnapshot } from "../../firebase";
import { Section } from '../ui/Section';
import { VARIANTS, EASING } from '../../lib/motion-presets';
import { formatDate } from "../../lib/firebase-utils";
import { cn } from '../../lib/utils';

// ============================================================================
// HELPER: Interactive Holographic 3D Mouse-Tilt Panel
// ============================================================================
const HolographicCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(0);
  const [glowY, setGlowY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Smooth angle mapping
    const rY = ((mouseX / width) - 0.5) * 8;
    const rX = (0.5 - (mouseY / height)) * 8;
    
    setRotateX(rX);
    setRotateY(rY);
    setGlowX(mouseX);
    setGlowY(mouseY);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotateX(0);
        setRotateY(0);
      }}
      onClick={onClick}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
        willChange: "transform"
      }}
    >
      {/* 3D Glowing Shimmer Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-[32px] overflow-hidden"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 240px at ${glowX}px ${glowY}px, rgba(0, 194, 255, 0.1), transparent 80%)`
        }}
      />
      {children}
    </div>
  );
};

export const FeaturedBlogsSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, "blogPosts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((post: any) => post.published !== false)
        .sort((a: any, b: any) => {
          const getMillis = (date: any) => {
            if (!date) return 0;
            if (typeof date.toMillis === 'function') return date.toMillis();
            if (typeof date.toDate === 'function') return date.toDate().getTime();
            if (date.seconds) return date.seconds * 1000;
            if (date._seconds) return date._seconds * 1000;
            return new Date(date).getTime();
          };
          return getMillis(b.createdAt) - getMillis(a.createdAt);
        });

      setPosts(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error fetching blog posts:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 3D Perspective Scroll transformations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 22 });

  const rotateXSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [8, 0, 0, -8]);
  const translateYSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [40, 0, 0, -40]);
  const scaleSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [0.96, 1, 1, 0.96]);
  const opacitySection = useTransform(smoothScroll, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  if (loading || posts.length === 0) return null;

  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1);

  return (
    <Section 
      id="featured-blogs" 
      glowVariant="side" 
      className="py-24 md:py-36 bg-[#070708] relative overflow-hidden"
    >
      {/* Cybernetic Micro-Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50 z-0" />
      
      {/* Projection Cyber Glow Source */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00C2FF]/3 rounded-full filter blur-[120px] pointer-events-none z-0 animate-pulse" />

      <div ref={sectionRef} className="w-full h-full relative z-10" style={{ perspective: 1200 }}>
        <motion.div 
          style={{ rotateX: rotateXSection, y: translateYSection, scale: scaleSection, opacity: opacitySection, transformStyle: "preserve-3d" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
            <div className="max-w-3xl">
              <motion.div
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="badge shadow-[0_0_20px_rgba(0,194,255,0.08)] bg-white/[0.01] border border-white/[0.06] text-[10px] font-bold uppercase tracking-widest text-[#00C2FF] flex items-center gap-1.5 px-4 py-2 rounded-full w-fit mb-6"
              >
                <BookOpen size={12} className="text-[#00C2FF]" /> ENGINEERING JOURNAL
              </motion.div>
              <h2 className="text-4xl sm:text-5xl lg:text-6.5xl font-black tracking-tight text-white leading-[1.08]">
                Editorial & <span className="text-[#00C2FF] font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.2)' }}>Chronicles.</span>
              </h2>
            </div>
            <Link 
              to="/blog" 
              className="group flex items-center gap-2.5 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border border-white/[0.06] hover:border-white/10 px-6 py-3.5 rounded-full bg-white/[0.01] shrink-0"
            >
              View Full Feed <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Asymmetric Bento-Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Bento Block Left: Large Featured Article Card (Spans 7 columns) */}
            <div className="lg:col-span-7">
              <HolographicCard className="group h-full bg-[#0D0D0E]/20 border border-white/[0.06] hover:border-[#00C2FF]/30 rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.55)] flex flex-col justify-between">
                <Link to={`/blog/${featuredPost.slug || featuredPost.id}`} className="flex flex-col h-full justify-between">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-black/40 border-b border-white/[0.06] relative">
                    {featuredPost.coverImage ? (
                      <img 
                        src={featuredPost.coverImage} 
                        alt={featuredPost.title} 
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="text-[#00C2FF] font-bold opacity-50">Technical Paper</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent" />
                    
                    {/* Category tag */}
                    {featuredPost.category && (
                      <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-[9px] font-bold uppercase tracking-widest text-[#00C2FF] border border-[#00C2FF]/20 shadow-lg">
                        {featuredPost.category}
                      </div>
                    )}
                  </div>

                  <div className="p-8 sm:p-10 flex flex-col flex-1 justify-between">
                    <div className="mb-8">
                      <div className="flex items-center gap-4 text-[10px] font-mono text-white/30 mb-4">
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(featuredPost.createdAt)}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {featuredPost.readTime || '5 min read'}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-[#00C2FF] transition-colors leading-tight mb-4">
                        {featuredPost.title}
                      </h3>
                      <p className="text-white/40 text-sm leading-relaxed font-medium line-clamp-3">
                        {featuredPost.description}
                      </p>
                    </div>

                    <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#00C2FF] group-hover:text-white transition-colors mt-auto">
                      Read Technical Paper <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </HolographicCard>
            </div>

            {/* Bento Block Right: Secondary List & Snap-scroll (Spans 5 columns) */}
            <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
              
              {/* Secondary List items */}
              <div className="space-y-6">
                {secondaryPosts.slice(0, 2).map((post) => (
                  <HolographicCard 
                    key={post.id} 
                    className="group bg-[#0D0D0E]/20 border border-white/[0.06] hover:border-[#00C2FF]/30 rounded-[32px] overflow-hidden shadow-lg p-6 cursor-pointer"
                  >
                    <Link to={`/blog/${post.slug || post.id}`} className="flex gap-6 items-center">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black/40 border border-white/[0.06] shrink-0 relative">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">LOG</div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-[9px] font-mono text-[#00C2FF] uppercase tracking-widest mb-1.5">
                          {post.category || 'LOGSTREAM'}
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-[#00C2FF] transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                        <div className="text-[10px] text-white/30 font-semibold mt-2">
                          {formatDate(post.createdAt)}
                        </div>
                      </div>
                    </Link>
                  </HolographicCard>
                ))}
              </div>

              {/* Horizontal Slider preview panel */}
              {secondaryPosts.length > 2 && (
                <div className="bg-[#0D0D0E]/20 border border-white/[0.06] rounded-[32px] p-6 relative overflow-hidden flex flex-col justify-between">
                  <div className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.2em] mb-4">
                    Other Registry Streams
                  </div>
                  
                  {/* Slider Container with responsive styling */}
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth snap-x snap-mandatory -webkit-overflow-scrolling-touch">
                    {secondaryPosts.slice(2).map((post) => (
                      <div 
                        key={post.id} 
                        className="snap-start shrink-0 w-64 bg-[#0A0A0B]/60 border border-white/[0.04] rounded-2xl p-4 hover:border-[#00C2FF]/20 transition-all duration-300"
                      >
                        <Link to={`/blog/${post.slug || post.id}`}>
                          <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest mb-1">
                            {post.category || 'SYSTEM'}
                          </div>
                          <h5 className="text-sm font-bold text-white line-clamp-2 leading-snug hover:text-[#00C2FF] transition-colors">
                            {post.title}
                          </h5>
                          <div className="text-[9px] text-white/20 mt-3 font-semibold">
                            {formatDate(post.createdAt)}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </motion.div>
      </div>
    </Section>
  );
};
export default FeaturedBlogsSection;
