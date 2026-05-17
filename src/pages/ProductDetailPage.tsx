import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Github, ShieldCheck, Cpu, Code, Layers, Zap } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';

interface ProductData {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  appUrl: string;
  githubUrl: string;
  status: string;
  tech: string[];
  features: string[];
  screenshotUrl: string;
}

const PRODUCTS_REGISTRY: Record<string, ProductData> = {
  "ai-life-navigator": {
    id: "ai-life-navigator",
    title: "AI Life Navigator",
    slug: "ai-life-navigator",
    category: "AI & Productivity",
    description: "An advanced, agentic productivity ecosystem that structures natural human goals into structured daily action items. Seamlessly parsing, prioritizing, and executing lifecycle tasks with minimal developer/user intervention.",
    appUrl: "https://ai-life-navigator.vercel.app",
    githubUrl: "https://github.com/guchchi/ai-life-navigator",
    status: "Production Node",
    tech: ["React 19", "TypeScript", "Google Gemini API", "Tailwind CSS", "Express.js", "Framer Motion"],
    features: [
      "Objective Parsing: Automatically translates conversational goals into step-by-step milestones.",
      "Dynamic Task Re-indexing: Intelligently updates schedule timelines based on live productivity telemetry.",
      "Agentic Execution: Deploys isolated worker logic to execute background analytical requests.",
      "Universal Search Hub: Centralized entry points to search and retrieve lifecycle data instantly."
    ],
    screenshotUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"
  }
};

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const product = slug ? PRODUCTS_REGISTRY[slug] : null;

  useSEO({
    title: product ? `${product.title} | Software Product by Ayush Paul` : "Loading Product Node...",
    description: product?.description || "",
    keywords: product?.tech.join(", ") || "",
    url: getCanonicalUrl(`/products/${slug}`),
    image: product?.screenshotUrl
  });

  // SEO: Inject JSON-LD SoftwareApplication Schema
  useEffect(() => {
    if (!product) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": product.title,
      "operatingSystem": "All",
      "applicationCategory": "BusinessApplication",
      "description": product.description,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Person",
        "name": "Ayush Paul"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [product]);

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Product Node Not Found</h2>
        <p className="text-white/40 mb-8">The requested software product does not exist in the active ecosystem registry.</p>
        <button onClick={() => navigate('/products')} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-bold">
          Return to Ecosystem Hub
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#0A0A0A] pt-32 pb-32"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-12 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Products
        </button>

        {/* Hero Conversion Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Left: Product Info & CTAs */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20">
                {product.category}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-green-400" /> Production Verified
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight">
              {product.title}
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-xl">
              {product.description}
            </p>

            {/* Micro Actions & Brand Loops */}
            <div className="flex flex-wrap gap-6 mb-12">
              <a 
                href={product.appUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-10 py-5 bg-brand-primary text-black rounded-3xl font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,194,255,0.25)] group"
              >
                Open Application <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              
              <a 
                href={product.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-10 py-5 bg-white/5 border border-white/10 text-white rounded-3xl font-bold text-base hover:bg-white/10 transition-all"
              >
                <Github size={18} /> View Repository
              </a>
            </div>

            {/* Quick Tech Specs */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Engineered With</span>
              <div className="flex flex-wrap gap-2">
                {product.tech.map((t, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-bold text-white/60">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Visual Schematics */}
          <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden glass border border-white/10 shadow-2xl shadow-brand-primary/5 group h-full">
            <img 
              src={product.screenshotUrl} 
              alt={product.title} 
              className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700"
            />
            {/* Ambient glows and gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-brand-primary flex items-center gap-1.5">
              <Zap size={10} fill="currentColor" /> Active Deploy
            </div>
          </div>
        </div>

        {/* Feature breakdown Section */}
        <div className="max-w-4xl mx-auto border-t border-white/5 pt-20">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-4">Inside the System</h2>
            <h3 className="text-3xl font-bold tracking-tight">Key Architectures & Capabilities</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {product.features.map((feat, idx) => {
              const [title, desc] = feat.split(": ");
              return (
                <div key={idx} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-brand-primary/10 transition-colors flex flex-col space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <Code size={18} />
                  </div>
                  <h4 className="text-lg font-bold tracking-tight text-white">{title}</h4>
                  <p className="text-sm text-white/40 leading-relaxed font-medium">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
