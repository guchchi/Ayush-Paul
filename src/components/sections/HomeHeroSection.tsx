import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Play, ArrowUpRight, CheckCircle2, Sparkles, BookOpen, Cpu } from "lucide-react";
import { useAnalytics } from "../../hooks/useAnalytics";

const HERO_VIDEO_SRC = '';

const HeroDemoCard = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (!HERO_VIDEO_SRC) return;
    const v = videoRef.current;
    if (!v) return;
    v.play();
    setPlaying(true);
  };

  const handlePause = () => setPlaying(false);

  return (
    <div className="relative w-full aspect-video rounded-t-2xl lg:rounded-t-3xl overflow-hidden shadow-lg border border-white/15 group bg-gradient-to-br from-[#0a1e35] via-[#0f2b4a] to-[#1a3a5c]">
      {HERO_VIDEO_SRC ? (
        <>
          <video
            ref={videoRef}
            onPause={handlePause}
            onEnded={handlePause}
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
          {!playing && (
            <>
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button onClick={handlePlay} className="w-14 h-14 md:w-16 md:h-16 bg-[#d1f34d] rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <Play size={20} className="text-black ml-1 fill-current" />
                </button>
              </div>
            </>
          )}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/80">
              Product Demo
            </span>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1e35]/80 via-[#0f2b4a]/60 to-[#1a3a5c]/80" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-sm shadow-lg">
              <Play size={20} className="text-white/60 ml-1" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#d1f34d]/15 border border-[#d1f34d]/25 text-[9px] font-bold uppercase tracking-widest text-[#d1f34d]">
              Product Demo
            </span>
            <p className="text-white/70 text-xs md:text-sm font-semibold text-center max-w-[280px] leading-relaxed">
              See how the execution system works
            </p>
          </div>
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full animate-pulse" />
              <span className="text-[8px] font-bold uppercase tracking-wider text-white/50">Demo preview</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const HomeHeroSection = () => {
  const { trackEvent } = useAnalytics();

  const handlePathwayClick = (formatName: string) => {
    trackEvent("learn_pathway_click", { format: formatName });
  };

  return (
    <>
      <style>{`
        .hero-bg {
          background: linear-gradient(180deg, #1A73E8 0%, #42A5F5 50%, #90CAF9 100%);
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
        }
        .hero-bg::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 60%, rgba(255,255,255,0.15) 0%, transparent 50%);
          pointer-events: none;
        }
        .hero-title {
          color: #ffffff !important;
        }
        .hero-description {
          color: rgba(255, 255, 255, 0.85) !important;
        }
        .hero-cta-dark {
          background-color: #0b1c30 !important;
          color: #ffffff !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .hero-cta-dark:hover {
          background-color: #1a3050 !important;
          color: #ffffff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 20px -5px rgba(11, 28, 48, 0.3) !important;
        }
        .hero-cta-lime {
          background-color: #d1f34d !important;
          color: #0b1c30 !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .hero-cta-lime:hover {
          background-color: #c0e045 !important;
          color: #0b1c30 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 20px -5px rgba(209, 243, 77, 0.4) !important;
        }
        :root.light .pathway-cta-dark-lime,
        .pathway-cta-dark-lime {
          background-color: #111111 !important;
          color: #d1f34d !important;
          border-radius: 9999px !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        :root.light .pathway-cta-dark-lime:hover,
        .pathway-cta-dark-lime:hover {
          background-color: #d1f34d !important;
          color: #111111 !important;
          transform: translateY(-2px) scale(1.05) !important;
          box-shadow: 0 10px 20px -5px rgba(209, 243, 77, 0.4) !important;
        }
        :root.light .pathway-card,
        .pathway-card {
          background-color: #ffffff !important;
          border: 1px solid rgba(194, 198, 214, 0.3) !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        :root.light .pathway-card:hover,
        .pathway-card:hover {
          background-color: #d1f34d !important;
          border-color: #d1f34d !important;
          transform: translateY(-6px) !important;
          box-shadow: 0 20px 40px -15px rgba(209, 243, 77, 0.35) !important;
        }
        :root.light .pathway-card-light-blue,
        .pathway-card-light-blue {
          background-color: rgba(239, 244, 255, 0.3) !important;
        }
        :root.light .pathway-badge,
        .pathway-badge {
          background-color: #d1f34d !important;
          color: #0b1c30 !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .pathway-card:hover .pathway-badge {
          background-color: #0b1c30 !important;
          color: #d1f34d !important;
        }
        .pathway-card:hover .pathway-cta-dark-lime:hover {
          background-color: #ffffff !important;
          color: #111111 !important;
          box-shadow: 0 10px 20px -5px rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="hero-bg border border-white/15 rounded-[32px] md:rounded-[40px] lg:rounded-[48px] overflow-hidden mx-4 md:mx-6 mb-6 mt-0 shadow-2xl">
        <main className="relative z-20 px-6 pt-32 md:pt-36 lg:pt-40 pb-6 md:pb-8 lg:pb-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <h1 className="hero-title text-[clamp(1.8rem,4.5vw,3.2rem)] font-extrabold leading-[1.12] tracking-tight max-w-3xl">
              Build Digital Products<br />
              With AI, Systems And<br />
              Execution
            </h1>
            <p className="hero-description text-sm md:text-base max-w-2xl leading-relaxed font-semibold mt-5 mb-8">
              A developer ecosystem crafting blueprints, courses, and automation scenarios to help you transition from concept to production.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                className="hero-cta-dark px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md cursor-pointer text-center"
                href="#pathways"
                onClick={() => trackEvent("hero_cta_click", { cta: "choose_pathway" })}
              >
                Choose Pathway
              </a>
              <Link 
                className="hero-cta-lime px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2.5 shadow-md"
                to="/collaborate"
                onClick={() => trackEvent("hero_cta_click", { cta: "start_building" })}
              >
                Start Building <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="flex items-center gap-2.5 mt-7">
              <div className="flex gap-0.5 text-[#d1f34d]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white/50 text-[11px] font-semibold tracking-wider">Trusted by builders, creators, and founders</span>
            </div>
          </div>
          <div className="mt-6 md:mt-8 max-w-[88%] mx-auto">
            <HeroDemoCard />
          </div>
        </main>
      </section>

      {/* CHOOSE YOUR PATH */}
      <section id="pathways" className="bg-bg-primary py-24 px-6 md:px-12 lg:px-24 text-left">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-6">
              THE PATHWAYS
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-[#0b1c30] tracking-tighter leading-[1.1] max-w-4xl mb-6 text-center">
              Tailored Structures for <br />
              Accelerating Development.
            </h2>
            <p className="text-base md:text-lg text-[#424754] max-w-2xl font-medium text-center leading-relaxed">
              Select the system level that fits your pipeline—speed up builds using ready-to-run blueprints, acquire structured thinking, or collaborate closely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
            <div className="pathway-card p-8 flex flex-col justify-between min-h-[420px] shadow-sm group">
              <div>
                <div className="w-12 h-12 pathway-badge rounded-2xl flex items-center justify-center mb-8">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0b1c30] mb-3">Build Faster</h3>
                <p className="text-sm text-[#424754] group-hover:text-[#0b1c30] leading-relaxed mb-6 font-medium">
                  Construct platforms using structured sitemaps, typescript boilerplates, automation sequences, and templates.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Framework blueprints
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Cursor Rule configurations
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Operational checklist playbooks
                  </li>
                </ul>
              </div>
              <Link to="/blueprints" onClick={() => handlePathwayClick("Build Faster")} className="w-full inline-flex items-center justify-center pathway-cta-dark-lime px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-sm">
                Browse Registry
              </Link>
            </div>

            <div className="pathway-card pathway-card-light-blue p-8 flex flex-col justify-between min-h-[420px] shadow-sm group">
              <div>
                <div className="w-12 h-12 pathway-badge rounded-2xl flex items-center justify-center mb-8">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0b1c30] mb-3">Learn Better</h3>
                <p className="text-sm text-[#424754] group-hover:text-[#0b1c30] leading-relaxed mb-6 font-medium">
                  Acquire the architectural thinking, prompt rules, and database schema configurations through structured syllabus modules.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Recorded syllabus classes
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Practical building workshops
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Active support group channels
                  </li>
                </ul>
              </div>
              <Link to="/mastery" onClick={() => handlePathwayClick("Learn Better")} className="w-full inline-flex items-center justify-center pathway-cta-dark-lime px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-sm">
                Explore Mastery
              </Link>
            </div>

            <div className="pathway-card p-8 flex flex-col justify-between min-h-[420px] shadow-sm group">
              <div>
                <div className="w-12 h-12 pathway-badge rounded-2xl flex items-center justify-center mb-8">
                  <Cpu size={24} />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0b1c30] mb-3">Studio</h3>
                <p className="text-sm text-[#424754] group-hover:text-[#0b1c30] leading-relaxed mb-6 font-medium">
                  Partner directly to outline roadmap strategies, configure custom data webhooks, and build high-performance products.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Product planning roadmaps
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    MVP architecture execution
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#424754] group-hover:text-[#0b1c30] font-medium">
                    <CheckCircle2 className="text-[#0b1c30]" size={16} />
                    Direct workflow configurations
                  </li>
                </ul>
              </div>
              <Link to="/collaborate" onClick={() => handlePathwayClick("Studio")} className="w-full inline-flex items-center justify-center pathway-cta-dark-lime px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-sm">
                Start Project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
