import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const CTA_BG_IMAGE = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2400";

export const HomeFinalCTASection = () => {
  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden flex flex-col items-center justify-center text-center bg-[#0a2540]">
      <div className="absolute inset-0 z-0">
        <img 
          alt="Abstract tech background" 
          className="w-full h-full object-cover opacity-40" 
          src={CTA_BG_IMAGE}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2540]/80 via-[#1a4b8c]/60 to-[#0a2540]/90"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 flex items-center gap-1.5 mb-8 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full animate-ping"></span>
          NEXT LEVEL
        </span>
        
        <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white tracking-tighter leading-[1.05] max-w-4xl mb-6 text-center">
          Turn Your Next Idea <br /> Into Production Reality
        </h2>
        
        <p className="text-sm md:text-base text-white/90 max-w-xl mb-12 text-center font-semibold leading-relaxed">
          Whether you require ready-to-use boilerplate blueprints, academy modules, or direct implementation support, choose the pathway to construct faster.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch mb-8 text-left">
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[24px] p-8 flex flex-col justify-between hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
            <div>
              <h3 className="text-xl font-extrabold text-white mb-2 uppercase tracking-tight">Registry Blueprints</h3>
              <p className="text-xs text-white/85 leading-relaxed font-semibold mb-8">Download Cursor rules settings, sitemap checklists, and boilerplate directories.</p>
            </div>
            <Link to="/blueprints" className="w-full inline-flex items-center justify-center bg-white text-black px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#d1f34d] hover:text-black transition-all">
              Browse Blueprints
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[24px] p-8 flex flex-col justify-between hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
            <div>
              <h3 className="text-xl font-extrabold text-white mb-2 uppercase tracking-tight">Mastery Ecosystem</h3>
              <p className="text-xs text-white/85 leading-relaxed font-semibold mb-8">Acquire modular code structures, prompt guides, and database designs.</p>
            </div>
            <Link to="/mastery" className="w-full inline-flex items-center justify-center bg-white text-black px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#d1f34d] hover:text-black transition-all">
              Explore Mastery
            </Link>
          </div>

          <div className="bg-[#0b1c30] border border-white/10 rounded-[24px] p-8 flex flex-col justify-between hover:border-[#d1f34d]/30 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#d1f34d]/10 rounded-full filter blur-xl pointer-events-none"></div>
            <div>
              <h3 className="text-xl font-extrabold text-[#d1f34d] mb-2 uppercase tracking-tight">Studio</h3>
              <p className="text-xs text-white/90 leading-relaxed font-semibold mb-8">Partner to compile roadmap metrics, setup API webhooks, and build SaaS products.</p>
            </div>
            <Link to="/collaborate" className="w-full inline-flex items-center justify-center bg-[#d1f34d] text-black px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
