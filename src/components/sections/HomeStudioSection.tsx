import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from "../../hooks/useAnalytics";
import { getKnowledgeGraph } from "../../lib/knowledge-graph/instance";

export const HomeStudioSection = () => {
  const { trackEvent } = useAnalytics();
  const workTogetherSectionRef = useRef<HTMLDivElement>(null);
  const [collaborationAreas, setCollaborationAreas] = useState<Array<{ title: string; description: string }>>([]);

  useEffect(() => {
    const loadStudioProjections = async () => {
      try {
        const kg = getKnowledgeGraph();
        const studioVM = await kg.studioProjection.getStudioViewModel('en');
        const areas = studioVM.categories.flatMap(c => 
          c.assets.map(a => ({ title: a.title, description: a.description }))
        );
        setCollaborationAreas(areas);
      } catch (err) {
        console.error("Failed to load studio projection:", err);
      }
    };
    loadStudioProjections();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent("work_together_section_view");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (workTogetherSectionRef.current) {
      observer.observe(workTogetherSectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleCardClick = (cardName: string, position: number) => {
    trackEvent("collaboration_area_click", {
      cardName,
      position,
      deviceType: window.innerWidth < 768 ? "mobile" : "desktop"
    });
  };

  return (
    <>
      <style>{`
        :root.light .collaboration-grid-card,
        .collaboration-grid-card {
          background-color: #ffffff !important;
          border: 1px solid rgba(194, 198, 214, 0.3) !important;
          border-radius: 20px !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        :root.light .collaboration-grid-card:hover,
        .collaboration-grid-card:hover {
          border-color: #d1f34d !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 20px -5px rgba(209, 243, 77, 0.15) !important;
        }
        
        :root.light .native-workflow-card,
        .native-workflow-card {
          background-color: #ffffff !important;
          border: 1px solid rgba(194, 198, 214, 0.25) !important;
          border-radius: 24px !important;
          padding: 24px !important;
          position: relative !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        :root.light .native-workflow-card:hover,
        .native-workflow-card:hover {
          border-color: #d1f34d !important;
          transform: translateY(-4px) scale(1.02) !important;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05) !important;
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
        
        .step-number-pill {
          background-color: #0b1c30;
          color: #d1f34d;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      `}</style>

      <section ref={workTogetherSectionRef} className="bg-[#f8f9ff] py-24 px-6 md:px-12 lg:px-24 text-left border-t border-gray-100 mt-0">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Content and story */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-6">
                STUDIO
              </span>

              <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-[#0b1c30] tracking-tighter leading-[1.1] mb-6 max-w-2xl">
                Need Help Bringing An Idea To Life?
              </h2>

              <p className="text-base text-[#424754] font-medium leading-relaxed max-w-[650px] mb-8">
                Sometimes learning isn't enough. Sometimes you need help implementing. Partner directly with a builder who helps turn ideas into execution.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[650px] mb-8">
                {collaborationAreas.map((card, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleCardClick(card.title, index + 1)}
                    className="collaboration-grid-card p-5 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#0b1c30] mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full"></span>
                        {card.title}
                      </h4>
                      <p className="text-xs text-[#424754] font-semibold leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-[650px] mb-12">
                <Link 
                  to="/collaborate" 
                  onClick={() => trackEvent('work_together_cta_click')}
                  className="pathway-cta-dark-lime px-8 py-4 text-xs font-bold uppercase tracking-widest shadow-md inline-flex items-center justify-center w-full sm:w-auto"
                >
                  Start a Project
                </Link>
                <Link 
                  to="/collaborate" 
                  onClick={() => trackEvent('discussion_cta_click')}
                  className="bg-transparent hover:bg-gray-50 border border-[#c2c6d6]/30 text-[#0b1c30] px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 inline-flex items-center justify-center w-full sm:w-auto"
                >
                  Work With Me
                </Link>
              </div>

              <div className="p-6 bg-white border border-[#c2c6d6]/25 rounded-[24px] w-full max-w-[650px] text-xs text-[#424754] font-medium space-y-4 shadow-sm">
                <div>
                  <h4 className="font-bold text-[#0b1c30] mb-1">Who is direct collaboration for?</h4>
                  <p className="font-semibold">Founders, creators, builders, students, and small businesses who want to speed up development and deploy production systems without the typical trial-and-error.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#0b1c30] mb-1">What can we build together?</h4>
                  <p className="font-semibold">Custom Next.js websites, autonomous LLM workflows, Make.com webhook integrations, database setups, and online business infrastructures.</p>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Native UI component (Build -> Launch -> Grow sequence) */}
            <div className="lg:col-span-5 w-full flex flex-col gap-6 relative mt-12 lg:mt-0 lg:pt-16">
              <div className="native-workflow-card flex gap-4 items-start shadow-sm">
                <div className="step-number-pill shrink-0">01 / BUILD</div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Architect &amp; Develop</h3>
                  <p className="text-xs text-[#424754] leading-relaxed font-semibold">
                    Set up clean Next.js sitemaps, type-safe database schemas, and structured Cursor AI rule configs.
                  </p>
                </div>
              </div>

              <div className="w-[2px] h-8 bg-[#d1f34d] ml-12 hidden lg:block"></div>

              <div className="native-workflow-card flex gap-4 items-start shadow-sm">
                <div className="step-number-pill shrink-0">02 / LAUNCH</div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Deploy &amp; Connect</h3>
                  <p className="text-xs text-[#424754] leading-relaxed font-semibold">
                    Configure serverless hosting pipelines, secure API integrations, and automate background Make.com scenario playbooks.
                  </p>
                </div>
              </div>

              <div className="w-[2px] h-8 bg-[#d1f34d] ml-12 hidden lg:block"></div>

              <div className="native-workflow-card flex gap-4 items-start shadow-sm">
                <div className="step-number-pill shrink-0">03 / GROW</div>
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Scale &amp; Optimize</h3>
                  <p className="text-xs text-[#424754] leading-relaxed font-semibold">
                    Deploy structural website SEO indexing, page-speed benchmarks, and automated event log tracking.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};
