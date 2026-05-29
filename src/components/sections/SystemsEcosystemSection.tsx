import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, CheckCircle, Activity, Cpu, Play, Terminal } from 'lucide-react';
import { Section } from '../ui/Section';
import { getPublishedProducts } from '../../lib/product-utils';
import { Product } from '../../types';
import { VARIANTS } from '../../lib/motion-presets';
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
          background: `radial-gradient(circle 240px at ${glowX}px ${glowY}px, rgba(0, 194, 255, 0.12), transparent 80%)`
        }}
      />
      {children}
    </div>
  );
};

export const SystemsEcosystemSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 3D Perspective Scroll Container Reference
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getPublishedProducts();
      // Keep only first 3 systems on the homepage for showcase
      setProducts(data.slice(0, 3));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const getSystemMetadata = (product: Product) => {
    const slug = product.slug || '';
    let version = 'v1.0.0';
    let difficulty = 'Intermediate';
    let hardware = ['ESP32 DevKit', 'Solid-State Relays', 'I2C Display'];

    if (slug.includes('vibecoder')) {
      version = 'v1.4.0-alpha';
      difficulty = 'Expert';
      hardware = ['Jetson Nano', 'STM32 Core board', 'OLED Telemetry'];
    } else if (slug.includes('boat') || slug.includes('marine')) {
      version = 'v2.1.0-stable';
      difficulty = 'Expert';
      hardware = ['Arduino Mega', 'Ublox GPS', 'Telemetry Radio 433MHz'];
    } else if (slug.includes('iobot') || slug.includes('companion')) {
      version = 'v1.2.0-beta';
      difficulty = 'Advanced';
      hardware = ['ESP32-S3 Core', 'MPU6050 IMU', 'LiPo Charger'];
    }

    return { version, difficulty, hardware };
  };

  // 3D Perspective Scroll transformations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 22 });

  const rotateXSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [4, 0, 0, -4]);
  const translateYSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [20, 0, 0, -20]);
  const scaleSection = useTransform(smoothScroll, [0, 0.35, 0.65, 1], [0.98, 1, 1, 0.98]);
  const opacitySection = useTransform(smoothScroll, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <Section 
      id="systems-ecosystem" 
      glowVariant="bottom" 
      className="!py-16 md:!py-24 bg-[#0A0A0B] relative overflow-hidden"
    >
      {/* Cinematic ambient glow carry-over from the Hero video */}
      <div className="absolute top-0 left-1/4 right-1/4 h-32 bg-[#00C2FF]/3 rounded-full filter blur-[80px] pointer-events-none z-0 animate-pulse" />

      {/* Cybernetic Micro-Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50 z-0" />
      
      {/* Projection Cyber Glow Source */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00C2FF]/4 rounded-full filter blur-[120px] pointer-events-none z-0 animate-pulse" />

      <div ref={sectionRef} className="w-full h-full relative z-10" style={{ perspective: 1200 }}>
        <motion.div 
          style={{ rotateX: rotateXSection, y: translateYSection, scale: scaleSection, opacity: opacitySection, transformStyle: "preserve-3d" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
        
        {/* Editorial Section Header */}
        <div className="max-w-4xl mb-16 md:mb-20 text-left">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="badge shadow-[0_0_20px_rgba(0,194,255,0.08)] bg-white/[0.01] border border-white/[0.06] text-[9px] font-mono uppercase tracking-[0.25em] text-[#00C2FF] flex items-center gap-1.5 px-4 py-2 rounded-full w-fit mb-6"
          >
            <Terminal size={14} className="text-[#00C2FF]" /> OPERATIONAL INFRASTRUCTURE REGISTER
          </motion.div>
          <motion.h2 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6.5xl font-black tracking-tight text-white leading-[1.08] uppercase"
          >
            Operational Systems <br className="hidden sm:inline" />
            & Cybernetic <span className="text-brand-primary font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.2)' }}>Frameworks.</span>
          </motion.h2>
          <motion.p 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-white/40 text-base sm:text-lg max-w-2xl mt-6 font-medium leading-relaxed"
          >
            A registry of active systems, edge micro-runtimes, and hardware models. Engineered as functional nodes establishing physical-digital intelligence.
          </motion.p>
        </div>

        {/* Flagship Product: Large Asymmetric Layout */}
        <div className="space-y-16">
          {loading ? (
            <div className="animate-pulse bg-white/5 rounded-[40px] aspect-[21/9] w-full" />
          ) : products.length > 0 && (
            (() => {
              const flagship = products[0];
              const { version, difficulty, hardware } = getSystemMetadata(flagship);

              return (
                <HolographicCard
                  className="group bg-[#0A0A0C]/35 border border-white/[0.04] hover:border-[#00C2FF]/20 rounded-[2.5rem] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)] w-full backdrop-blur-md"
                >
                  <div className="grid lg:grid-cols-12 gap-0 items-stretch">
                    {/* Visual Cover (7 cols) */}
                    <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto min-h-[360px] relative overflow-hidden bg-black/40 border-b lg:border-b-0 lg:border-r border-white/[0.05]">
                      <img 
                        src={flagship.thumbnail || "/placeholder.jpg"} 
                        alt={flagship.title} 
                        className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-[1.01] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/95 via-black/40 to-transparent" />
                      
                      {/* Active Status Tag */}
                      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex gap-2">
                        <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.08] text-[9px] font-bold text-[#00C2FF] tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
                          <Activity size={10} className="animate-pulse text-[#00C2FF]" /> SYSTEM NODE
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.08] text-[9px] font-bold text-white/50 tracking-widest uppercase shadow-lg">
                          {flagship.category}
                        </span>
                      </div>

                      {/* Technical Spec Labels */}
                      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 flex flex-wrap gap-2">
                        <div className="bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-full px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5 shadow-lg">
                          <Cpu size={11} className="text-[#00C2FF]" /> CLASSIFICATION: CLASS-III
                        </div>
                        <div className="bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-full px-3.5 py-1.5 text-[9px] font-mono font-bold tracking-wider text-[#00C2FF] flex items-center gap-1.5 shadow-lg">
                          {version}
                        </div>
                      </div>
                    </div>

                    {/* Metadata Content (5 cols) */}
                    <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="text-[10px] font-mono text-[#00C2FF] font-bold uppercase tracking-[0.25em]">Flagship Systems Division</div>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-[#00C2FF] transition-colors leading-tight uppercase">
                          {flagship.title}
                        </h3>
                        <p className="text-white/45 text-sm leading-relaxed font-medium">
                          {flagship.description}
                        </p>

                        {/* Telemetry Hardware specifications */}
                        <div className="space-y-3 pt-6 border-t border-white/[0.05]">
                          <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] mb-3">TACTILE BUS INTERFACE DIAGRAM</div>
                          <div className="grid grid-cols-1 gap-2">
                            {hardware.map((hw) => (
                              <div key={hw} className="flex items-center gap-2 text-xs font-mono text-white/40">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00C2FF]/30 shrink-0" /> {hw}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Link */}
                        <div className="pt-6 border-t border-white/[0.05]">
                          <Link 
                            to={`/systems/${flagship.slug}`} 
                            className="group/btn w-full py-4 bg-white text-black hover:bg-[#00C2FF] rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
                          >
                            ACCESS INTEL RUNTIME
                            <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </HolographicCard>
              );
            })()
          )}

          {/* Secondary Systems Asymmetric Bento Grid (2 items split into different layouts) */}
          <div className="grid lg:grid-cols-12 gap-8">
            {!loading && products.slice(1).map((system, idx) => {
              const { version, difficulty, hardware } = getSystemMetadata(system);
              const isEven = idx % 2 === 0;

              return (
                <div 
                  key={system.id}
                  className={cn(
                    "h-full",
                    isEven ? "lg:col-span-7" : "lg:col-span-5"
                  )}
                >
                  <HolographicCard
                    className="group bg-[#0A0A0C]/35 border border-white/[0.04] hover:border-[#00C2FF]/20 rounded-[2.5rem] overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.55)] flex flex-col justify-between h-full min-h-[480px] cursor-pointer backdrop-blur-md"
                  >
                    {/* Visual Card Cover */}
                    <div className="aspect-[16/10] relative overflow-hidden bg-black/40 border-b border-white/[0.05] shrink-0">
                      <img 
                        src={system.thumbnail || "/placeholder.jpg"} 
                        alt={system.title} 
                        className="w-full h-full object-cover opacity-75 group-hover:scale-[1.01] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                      
                      <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.08] text-[9px] font-bold text-[#00C2FF] tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
                        SYSTEM NODE
                      </div>

                      <div className="absolute bottom-6 left-6 text-[10px] font-mono font-bold text-[#00C2FF] bg-black/60 backdrop-blur-md px-3.5 py-1.5 border border-white/[0.08] rounded-full">
                        {version}
                      </div>
                    </div>

                    {/* Card Description */}
                    <div className="p-8 flex flex-col justify-between flex-grow">
                      <div className="space-y-4 mb-6">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#00C2FF] transition-colors leading-tight uppercase">
                          {system.title}
                        </h3>
                        <p className="text-white/40 text-xs leading-relaxed font-medium font-display line-clamp-2">
                          {system.description}
                        </p>
                      </div>

                      <div className="border-t border-white/[0.05] pt-6 flex items-center justify-between mt-auto">
                        <Link 
                          to={`/systems/${system.slug}`}
                          className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-widest text-[#00C2FF] group-hover:text-white transition-colors"
                        >
                          <span>ACCESS TELEMETRY SCHEMA</span>
                          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </HolographicCard>
                </div>
              );
            })}
          </div>
        </div>

        </motion.div>
      </div>
    </Section>
  );
};
export default SystemsEcosystemSection;
